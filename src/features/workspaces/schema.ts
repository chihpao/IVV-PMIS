import { z } from 'zod';

import messages from '../../../messages/zh-TW.json';

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.workspaceNameRequired),
  image: z.union([z.instanceof(File), z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.workspaceNameMin).optional(),
  image: z.union([z.instanceof(File), z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
});
