import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { updateTaskLists } from '@/features/tasks/api/task-cache';
import type { Task } from '@/features/tasks/types';
import { client } from '@/lib/hono';
import { toast } from '@/lib/sonner';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$delete']>;
type MutationContext = {
  previousTasks: Array<[QueryKey, unknown]>;
  previousTask?: Task;
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType, MutationContext>({
    onMutate: async ({ param }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', param.taskId] });

      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });
      const previousTask = queryClient.getQueryData<Task>(['task', param.taskId]);

      updateTaskLists(queryClient, (data) => {
        const nextDocuments = data.documents.filter((task) => task.$id !== param.taskId);

        if (nextDocuments.length === data.documents.length) return data;

        const total = typeof data.total === 'number' ? Math.max(0, data.total - 1) : nextDocuments.length;

        return {
          ...data,
          documents: nextDocuments,
          total,
        };
      });

      queryClient.removeQueries({ queryKey: ['task', param.taskId], exact: true });

      return { previousTasks, previousTask };
    },
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId']['$delete']({ param });

      if (!response.ok) throw new Error(t('taskDeleteFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('taskDeleted'));

      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics', data.workspaceId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics', data.projectId],
        exact: true,
      });
    },
    onError: (error, _variables, context) => {
      console.error('[DELETE_TASK]: ', error);

      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousTask) {
        queryClient.setQueryData(['task', context.previousTask.$id], context.previousTask);
      }

      toast.error(t('taskDeleteFailed'));
    },
  });

  return mutation;
};
