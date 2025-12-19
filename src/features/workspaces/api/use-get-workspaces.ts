import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

export const useGetWorkspaces = () => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response.ok) throw new Error(tErrors('fetchWorkspacesFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
