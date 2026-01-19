import { Models } from 'node-appwrite';

import { Member } from '@/features/members/types';

export type Comment = Models.Document & {
  content: string;
  taskId: string;
  workspaceId: string;
  userId: string;
  author?: Member; // Populated author
};
