import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';
import { toast } from '@/lib/sonner';

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$delete']>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[':projectId']['$delete']({ param });

      if (!response.ok) throw new Error(t('projectDeleteFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('projectDeleted'));

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['project', data.$id],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[DELETE_PROJECT]: ', error);

      toast.error(t('projectDeleteFailed'));
    },
  });

  return mutation;
};
