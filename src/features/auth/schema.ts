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
  // jobTitle: z.string().optional(), // Removed for now to keep it simple as confirmed for "Name" functionality primarily.
  // Actually, I'll stick to just name first as getting prefs might complicate the user object typing if not strictly typed everywhere.
  // User said "Name... other you think". If I add jobTitle, I need to make sure I fetch it too.
  // The 'user' object returned by useCurrent typically has prefs.
});
