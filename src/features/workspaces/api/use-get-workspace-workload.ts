import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface useGetWorkspaceWorkloadProps {
  workspaceId: string;
}

export const useGetWorkspaceWorkload = ({ workspaceId }: useGetWorkspaceWorkloadProps) => {
  const tErrors = useTranslations('Errors');

  const query = useQuery({
    queryKey: ['workspace-workload', workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId'].workload.$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error(tErrors('fetchWorkspaceAnalyticsFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
