import { z } from 'zod';

import messages from '../../../messages/zh-TW.json';
import { TaskStatus } from './types';

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.taskNameRequired),
  status: z.nativeEnum(TaskStatus, {
    required_error: messages.Validation.taskStatusRequired,
  }),
  workspaceId: z.string().trim().min(1, messages.Validation.workspaceIdRequired),
  projectId: z.string().trim().min(1, messages.Validation.projectRequired),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, messages.Validation.assigneeRequired),
  description: z.string().optional(),

});
