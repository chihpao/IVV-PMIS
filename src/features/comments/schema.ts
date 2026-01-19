import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, '留言內容不能為空'),
  taskId: z.string().trim().min(1),
  workspaceId: z.string().trim().min(1),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1, '留言內容不能為空'),
});
