import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import type { Project } from '@/features/projects/types';
import type { Task } from '@/features/tasks/types';
import { getFileViewUrl } from '@/lib/appwrite-file-url';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono().get(
  '/',
  sessionMiddleware,
  zValidator(
    'query',
    z.object({
      workspaceId: z.string(),
      search: z.string().min(1),
    }),
  ),
  async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');
    const { workspaceId, search } = ctx.req.valid('query');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    // Appwrite search works best with indexing, but for small datasets or prefix/suffix,
    // we might need multiple queries if fulltext isn't perfect for all languages.
    // For now, we use Query.search which matches indexed words.

    // Check if it's primarily alphanumeric for safer Query.search usage
    const isAlphanumeric = /^[\x00-\x7F]+$/.test(search);
    const query = [Query.equal('workspaceId', workspaceId), Query.limit(5)];

    const [projects, tasks] = await Promise.all([
      databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
        ...query,
        isAlphanumeric ? Query.search('name', search) : Query.contains('name', search),
      ]),
      databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        ...query,
        isAlphanumeric ? Query.search('name', search) : Query.contains('name', search),
      ]),
    ]);

    const projectsWithImages = projects.documents.map((project) => ({
      ...project,
      imageUrl: project.imageId ? getFileViewUrl(project.imageId) : undefined,
    }));

    return ctx.json({
      data: {
        projects: projectsWithImages,
        tasks: tasks.documents,
      },
    });
  },
);

export default app;
