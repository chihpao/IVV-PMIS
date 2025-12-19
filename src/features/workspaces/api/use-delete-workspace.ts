import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['$delete']>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId']['$delete']({ param });

      if (!response.ok) throw new Error(t('workspaceDeleteFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('workspaceDeleted'));

      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[DELETE_WORKSPACE]: ', error);

      toast.error(t('workspaceDeleteFailed'));
    },
  });

  return mutation;
};
