import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)['$post']>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['$post']({ json });

      if (!response.ok) throw new Error(t('taskCreateFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('taskCreated'));

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
    },
    onError: (error) => {
      console.error('[CREATE_TASK]: ', error);

      toast.error(t('taskCreateFailed'));
    },
  });

  return mutation;
};
