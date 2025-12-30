import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import type { TaskStatus } from '@/features/tasks/types';
import { client } from '@/lib/hono';

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string[] | null;
  status?: TaskStatus[] | null;
  assigneeId?: string[] | null;
  dueDate?: string | null;
  limit?: number | null;
}

export const useGetTasks = ({ workspaceId, projectId, status, assigneeId, dueDate, limit }: useGetTasksProps) => {
  const tErrors = useTranslations('Errors');
  const statusKey = status?.join(',') ?? null;
  const projectKey = projectId?.join(',') ?? null;
  const assigneeKey = assigneeId?.join(',') ?? null;
  const normalizedLimit = typeof limit === 'number' ? limit : 200;
  const query = useQuery({
    queryKey: ['tasks', workspaceId, projectKey, statusKey, assigneeKey, dueDate, normalizedLimit],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId?.length ? projectId.join(',') : undefined,
          status: status?.length ? status.join(',') : undefined,
          assigneeId: assigneeId?.length ? assigneeId.join(',') : undefined,
          dueDate: dueDate ?? undefined,
          limit: normalizedLimit,
        },
      });

      if (!response.ok) throw new Error(tErrors('fetchTasksFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
