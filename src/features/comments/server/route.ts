import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { COMMENTS_ID, DATABASE_ID, MEMBERS_ID } from '@/config/db';
import { createCommentSchema } from '@/features/comments/schema';
import { Comment } from '@/features/comments/types';
import { Member } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        taskId: z.string(),
        workspaceId: z.string(),
      }),
    ),
    async (ctx) => {
      const databases = ctx.get('databases');
      const user = ctx.get('user');
      const { taskId, workspaceId } = ctx.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const comments = await databases.listDocuments<Comment>(DATABASE_ID, COMMENTS_ID, [
        Query.equal('taskId', taskId),
        Query.equal('workspaceId', workspaceId),
        Query.orderAsc('$createdAt'),
      ]);

      const authorIds = [...new Set(comments.documents.map((comment) => comment.userId))];

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        authorIds.length > 0 ? [Query.equal('userId', authorIds), Query.equal('workspaceId', workspaceId)] : [],
      );

      const authors = members.documents;

      const populatedComments = comments.documents.map((comment) => {
        const author = authors.find((member) => member.userId === comment.userId);

        return {
          ...comment,
          author,
        };
      });

      return ctx.json({
        data: {
          ...comments,
          documents: populatedComments,
        },
      });
    },
  )
  .post('/', sessionMiddleware, zValidator('json', createCommentSchema), async (ctx) => {
    const user = ctx.get('user');
    const databases = ctx.get('databases');
    const { content, taskId, workspaceId } = ctx.req.valid('json');

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
    });

    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const comment = await databases.createDocument<Comment>(DATABASE_ID, COMMENTS_ID, ID.unique(), {
        content,
        taskId,
        workspaceId,
        userId: user.$id, // Store userId to link back to Member profile later
    });

    return ctx.json({ data: comment });
  });

export default app;
