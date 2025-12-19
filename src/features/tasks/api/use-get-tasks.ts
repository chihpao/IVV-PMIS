import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import type { TaskStatus } from '@/features/tasks/types';
import { client } from '@/lib/hono';

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  limit?: number | null;
}

export const useGetTasks = ({ workspaceId, projectId, status, search, assigneeId, dueDate, limit }: useGetTasksProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['tasks', workspaceId, projectId, status, search, assigneeId, dueDate, limit],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          limit: limit ?? undefined,
        },
      });

      if (!response.ok) throw new Error(tErrors('fetchTasksFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
