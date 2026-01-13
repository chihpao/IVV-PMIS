import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID, WORKSPACES_ID } from '@/config/db';
import { type Member, MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import type { Project } from '@/features/projects/types';
import { type Task, TaskStatus } from '@/features/tasks/types';
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/features/workspaces/schema';
import type { Workspace } from '@/features/workspaces/types';
import { getFileViewUrl } from '@/lib/appwrite-file-url';
import { sessionMiddleware } from '@/lib/session-middleware';
import { generateInviteCode } from '@/lib/utils';

const app = new Hono()
  .get('/', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);

    if (members.total === 0) return ctx.json({ data: { documents: [], total: 0 } });

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments<Workspace>(DATABASE_ID, WORKSPACES_ID, [
      Query.contains('$id', workspaceIds),
      Query.orderDesc('$createdAt'),
    ]);

    const workspacesWithImages: (Workspace & { imageUrl?: string })[] = workspaces.documents.map((workspace) => ({
      ...workspace,
      imageUrl: workspace.imageId ? getFileViewUrl(workspace.imageId) : undefined,
    }));

    return ctx.json({
      data: {
        documents: workspacesWithImages,
        total: workspaces.total,
      },
    });
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');
    const user = ctx.get('user');

    const { name, image } = ctx.req.valid('form');

    let uploadedImageId: string | undefined = undefined;

    if (image instanceof File) {
      const fileExt = image.name.split('.').at(-1) ?? 'png';
      const fileName = `${ID.unique()}.${fileExt}`;

      const renamedImage = new File([image], fileName, {
        type: image.type,
      });
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), renamedImage);

      uploadedImageId = file.$id;
    } else {
      uploadedImageId = image;
    }

    const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
      name,
      userId: user.$id,
      imageId: uploadedImageId,
      inviteCode: generateInviteCode(6),
    });

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      userId: user.$id,
      workspaceId: workspace.$id,
      role: MemberRole.ADMIN,
      name: user.name,
      email: user.email,
    });

    return ctx.json({ data: workspace });
  })
  .get('/:workspaceId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const databases = ctx.get('databases');
    const { workspaceId } = ctx.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json(
        {
          error: 'Unauthorized.',
        },
        401,
      );
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    const imageUrl = workspace.imageId ? getFileViewUrl(workspace.imageId) : undefined;

    return ctx.json({
      data: {
        ...workspace,
        imageUrl,
      },
    });
  })
  .get('/:workspaceId/info', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const { workspaceId } = ctx.req.param();

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return ctx.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
      },
    });
  })
  .patch('/:workspaceId', sessionMiddleware, zValidator('form', updateWorkspaceSchema), async (ctx) => {
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');
    const user = ctx.get('user');

    const { workspaceId } = ctx.req.param();
    const { name, image } = ctx.req.valid('form');

    const existingWorkspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json(
        {
          error: 'Unauthorized.',
        },
        401,
      );
    }

    let uploadedImageId: string | undefined = undefined;

    if (image instanceof File) {
      const fileExt = image.name.split('.').at(-1) ?? 'png';
      const fileName = `${ID.unique()}.${fileExt}`;

      const renamedImage = new File([image], fileName, {
        type: image.type,
      });

      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), renamedImage);

      // delete old project image
      if (existingWorkspace.imageId) await storage.deleteFile(IMAGES_BUCKET_ID, existingWorkspace.imageId);

      uploadedImageId = file.$id;
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      name,
      imageId: uploadedImageId,
    });

    return ctx.json({ data: workspace });
  })
  .delete('/:workspaceId', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');
    const user = ctx.get('user');

    const { workspaceId } = ctx.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const existingWorkspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    const members = await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [Query.equal('workspaceId', workspaceId)]);

    const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [Query.equal('workspaceId', workspaceId)]);

    const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [Query.equal('workspaceId', workspaceId)]);

    // delete members
    for (const member of members.documents) {
      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id);
    }

    // delete projects
    for (const project of projects.documents) {
      if (project.imageId) await storage.deleteFile(IMAGES_BUCKET_ID, project.imageId);
      await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, project.$id);
    }

    // delete tasks
    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
    }

    if (existingWorkspace.imageId) storage.deleteFile(IMAGES_BUCKET_ID, existingWorkspace.imageId);

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return ctx.json({ data: { $id: workspaceId } });
  })
  .post('/:workspaceId/resetInviteCode', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');

    const { workspaceId } = ctx.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      inviteCode: generateInviteCode(6),
    });

    return ctx.json({ data: workspace });
  })
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        code: z.string(),
      }),
    ),
    async (ctx) => {
      const { workspaceId } = ctx.req.param();
      const { code } = ctx.req.valid('json');

      const databases = ctx.get('databases');
      const user = ctx.get('user');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return ctx.json({ error: 'Already a member.' }, 400);
      }

      const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

      if (workspace.inviteCode !== code) {
        return ctx.json({ error: 'Invalid invite code.' }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
        name: user.name,
        email: user.email,
      });

      return ctx.json({ data: workspace });
    },
  )
  .get('/:workspaceId/analytics', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const now = new Date();

    const [allTasks, assignedTasks, incompleteTasks, completedTasks, overdueTasks] = await Promise.all([
      databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [Query.equal('workspaceId', workspaceId), Query.limit(1)]),
      databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.equal('assigneeId', member.$id),
        Query.limit(1),
      ]),
      databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.limit(1),
      ]),
      databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.equal('status', TaskStatus.DONE),
        Query.limit(1),
      ]),
      databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.limit(1),
      ]),
    ]);

    const taskCount = allTasks.total;
    const taskDifference = 0;

    const assignedTaskCount = assignedTasks.total;
    const assignedTaskDifference = 0;

    const incompleteTaskCount = incompleteTasks.total;
    const incompleteTaskDifference = 0;

    const completedTaskCount = completedTasks.total;
    const completedTaskDifference = 0;

    const overdueTaskCount = overdueTasks.total;
    const overdueTaskDifference = 0;

    return ctx.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  });

export default app;
