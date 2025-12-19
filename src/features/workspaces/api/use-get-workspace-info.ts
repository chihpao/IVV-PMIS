import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface useGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceInfoProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['workspace-info', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId']['info'].$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error(tErrors('fetchWorkspaceInfoFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
