import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface useGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId'].$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error(tErrors('fetchWorkspaceFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
