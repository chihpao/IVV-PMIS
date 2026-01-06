import { Models } from 'node-appwrite';

import type { Project } from '@/features/projects/types';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  workspaceId: string;
  position: number;
  dueDate: string;
  description?: string;
  project?: Project & { imageUrl?: string };
  assignee?: Models.Document & { name: string; email: string };
};
