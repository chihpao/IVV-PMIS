import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$delete']>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
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
      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['task', data.$id],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[DELETE_TASK]: ', error);

      toast.error(t('taskDeleteFailed'));
    },
  });

  return mutation;
};
