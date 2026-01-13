import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { taskMatchesFilters, updateTaskLists } from '@/features/tasks/api/task-cache';
import type { Task } from '@/features/tasks/types';
import { client } from '@/lib/hono';
import { toast } from '@/lib/sonner';

type ResponseType = InferResponseType<(typeof client.api.tasks)['bulk-update']['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)['bulk-update']['$post']>;
type MutationContext = {
  previousTasks: Array<[QueryKey, unknown]>;
  previousTaskDetails: Array<[QueryKey, unknown]>;
};

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType, MutationContext>({
    onMutate: async ({ json }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });
      const previousTaskDetails = queryClient.getQueriesData({ queryKey: ['task'] });

      const updates = new Map(json.tasks.map((task) => [task.$id, task]));

      updateTaskLists(queryClient, (data, filters) => {
        let removedCount = 0;
        const nextDocuments = data.documents.flatMap((task) => {
          const update = updates.get(task.$id);
          if (!update) return [task];

          const updatedTask: Task = {
            ...task,
            status: update.status,
            position: update.position,
          };

          if (!taskMatchesFilters(updatedTask, filters)) {
            removedCount += 1;
            return [];
          }

          return [updatedTask];
        });

        const total = typeof data.total === 'number' ? Math.max(0, data.total - removedCount) : nextDocuments.length;

        return {
          ...data,
          documents: nextDocuments,
          total,
        };
      });

      json.tasks.forEach((task) => {
        queryClient.setQueryData(['task', task.$id], (current) => {
          if (!current || typeof current !== 'object') return current;
          return {
            ...(current as Task),
            status: task.status,
            position: task.position,
          };
        });
      });

      return { previousTasks, previousTaskDetails };
    },
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['bulk-update']['$post']({ json });

      if (!response.ok) throw new Error(t('tasksUpdateFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('tasksUpdated'));

      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics', data.workspaceId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics'],
        exact: false,
      });
    },
    onError: (error, _variables, context) => {
      console.error('[BULK_UPDATE_TASKS]: ', error);

      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousTaskDetails.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error(t('tasksUpdateFailed'));
    },
  });

  return mutation;
};
