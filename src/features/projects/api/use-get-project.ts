import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { client } from '@/lib/hono';

interface useGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: useGetProjectProps) => {
  const tErrors = useTranslations('Errors');
  const query = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await client.api.projects[':projectId'].$get({
        param: { projectId },
      });

      if (!response.ok) throw new Error(tErrors('fetchProjectFailed'));

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
