import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['analytics']['$get'], 200>;

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: async () => {
      const response = await client.api.projects[':projectId'].analytics.$get({
        param: { projectId },
      });

      if (!response.ok) throw new Error(tErrors('fetchProjectAnalyticsFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
