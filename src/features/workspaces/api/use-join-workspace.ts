import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['join']['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['join']['$post']>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[':workspaceId']['join']['$post']({ param, json });

      if (!response.ok) throw new Error(t('workspaceJoinFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('workspaceJoined'));

      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[JOIN_WORKSPACE]: ', error);

      toast.error(t('workspaceJoinFailed'));
    },
  });

  return mutation;
};
