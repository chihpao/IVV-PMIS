import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface useGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['projects', workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error(tErrors('fetchProjectsFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
