import { z } from 'zod';

import messages from '../../../messages/zh-TW.json';

export const signInFormSchema = z.object({
  email: z.string().trim().email({
    message: messages.Validation.invalidEmail,
  }),
  password: z.string({
    required_error: messages.Validation.passwordRequired,
  }),
});

export const signUpFormSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.fullNameRequired),
  email: z.string().trim().min(1, messages.Validation.emailRequired).email({
    message: messages.Validation.invalidEmail,
  }),
  password: z.string().min(8, messages.Validation.passwordMin).max(256, messages.Validation.passwordMax),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, messages.Validation.fullNameRequired).optional(),
  password: z.string().min(8, messages.Validation.passwordMin).max(256, messages.Validation.passwordMax).optional(),
  oldPassword: z.string().optional(),
});
