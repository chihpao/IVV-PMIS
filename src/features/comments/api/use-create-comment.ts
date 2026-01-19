import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';
import { toast } from '@/lib/sonner';

type ResponseType = InferResponseType<(typeof client.api.comments)['$post']>;
type RequestType = InferRequestType<(typeof client.api.comments)['$post']>;

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.comments['$post']({ json });

      if (!response.ok) throw new Error('Failed to create comment');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.taskId] });
      toast.success('留言已發送');
    },
    onError: (error) => {
      console.error('[CREATE_COMMENT]: ', error);
      toast.error('留言發送失敗');
    },
  });

  return mutation;
};
