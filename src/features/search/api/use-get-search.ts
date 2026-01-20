import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

interface UseGetSearchProps {
  workspaceId: string;
  search: string;
}

export const useGetSearch = ({ workspaceId, search }: UseGetSearchProps) => {
  const query = useQuery({
    queryKey: ['search', workspaceId, search],
    enabled: !!workspaceId && search.length >= 1,
    queryFn: async () => {
      const response = await client.api.search.$get({
        query: {
          workspaceId,
          search,
        },
      });

      if (!response.ok) throw new Error('Fetch search failed.');

      const { data } = await response.json();

      return data;
    },
    // Keep data fresh for search but allow small lag
    staleTime: 5000,
  });

  return query;
};
