import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import type { TaskStatus } from '@/features/tasks/types';
import { client } from '@/lib/hono';

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string[] | null;
  status?: TaskStatus[] | null;
  search?: string | null;
  assigneeId?: string[] | null;
  dueDate?: string | null;
  limit?: number | null;
}

export const useGetTasks = ({ workspaceId, projectId, status, search: _search, assigneeId, dueDate, limit }: useGetTasksProps) => {
  const tErrors = useTranslations('Errors');
  const statusKey = status?.join(',') ?? null;
  const projectKey = projectId?.join(',') ?? null;
  const assigneeKey = assigneeId?.join(',') ?? null;
  const query = useQuery({
    queryKey: ['tasks', workspaceId, projectKey, statusKey, _search, assigneeKey, dueDate, limit],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId?.length ? projectId.join(',') : undefined,
          status: status?.length ? status.join(',') : undefined,
          assigneeId: assigneeId?.length ? assigneeId.join(',') : undefined,
          search: _search ?? undefined,
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
