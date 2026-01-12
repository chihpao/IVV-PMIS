import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.projects)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)['$post']>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({ form });

      if (!response.ok) throw new Error(t('projectCreateFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('projectCreated'));

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[CREATE_PROJECT]: ', error);

      toast.error(t('projectCreateFailed'));
    },
  });

  return mutation;
};
