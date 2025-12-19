import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface UseGetMembersProps {
  workspaceId: string;
  limit?: number | null;
}

export const useGetMembers = ({ workspaceId, limit }: UseGetMembersProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['members', workspaceId, limit],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: {
          workspaceId,
          limit: limit ?? undefined,
        },
      });

      if (!response.ok) throw new Error(tErrors('fetchMembersFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
