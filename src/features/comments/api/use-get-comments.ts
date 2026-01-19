import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

interface UseGetCommentsProps {
  taskId: string;
  workspaceId: string;
}

export const useGetComments = ({ taskId, workspaceId }: UseGetCommentsProps) => {
  const query = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const response = await client.api.comments.$get({
        query: { taskId, workspaceId },
      });

      if (!response.ok) throw new Error('Failed to fetch comments');

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
