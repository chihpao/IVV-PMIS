import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.members)[':memberId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[':memberId']['$patch']>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[':memberId']['$patch']({ param, json });

      if (!response.ok) throw new Error(t('memberUpdateFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('memberUpdated'));

      queryClient.invalidateQueries({
        queryKey: ['members', data.workspaceId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[UPDATE_MEMBER]: ', error);

      toast.error(t('memberUpdateFailed'));
    },
  });

  return mutation;
};
