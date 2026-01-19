import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';
import { toast } from '@/lib/sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.current)['$patch']>;
type RequestType = InferRequestType<(typeof client.api.auth.current)['$patch']>;

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.current['$patch']({ json });

      if (!response.ok) throw new Error(t('registerFailed')); // Reuse failure message or create 'profileUpdateFailed'

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
      toast.success(t('memberUpdated')); // Reuse memberUpdated or make new one
    },
    onError: (error) => {
      console.error('[UPDATE_USER]: ', error);
      toast.error(t('memberUpdateFailed'));
    },
  });

  return mutation;
};
