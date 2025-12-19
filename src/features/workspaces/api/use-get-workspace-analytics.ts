import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type WorkspaceAnalyticsResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['analytics']['$get'], 200>;

export const useGetWorkspaceAnalytics = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['workspace-analytics', workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId'].analytics.$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error(tErrors('fetchWorkspaceAnalyticsFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
