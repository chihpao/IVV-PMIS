import { z } from 'zod';

import messages from '../../../messages/zh-TW.json';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.projectNameRequired),
  image: z.union([z.instanceof(File), z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
  workspaceId: z.string({
    message: messages.Validation.workspaceIdRequired,
  }),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.projectNameRequired).optional(),
  image: z.union([z.instanceof(File), z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
  workspaceId: z.string({
    message: messages.Validation.workspaceIdRequired,
  }),
});
