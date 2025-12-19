import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface useGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: useGetTaskProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId'].$get({
        param: {
          taskId,
        },
      });

      if (!response.ok) throw new Error(tErrors('fetchTaskFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
