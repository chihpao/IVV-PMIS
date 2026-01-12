import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.workspaces)['$post']>;
type RequestType = InferRequestType<(typeof client.api.workspaces)['$post']>;

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces['$post']({ form });

      if (!response.ok) throw new Error(t('workspaceCreateFailed'));

      return await response.json();
    },
    onSuccess: () => {
      toast.success(t('workspaceCreated'));

      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      });
    },
    onError: (error) => {
      console.error('[CREATE_WORKSPACE]: ', error);

      toast.error(t('workspaceCreateFailed'));
    },
  });

  return mutation;
};
