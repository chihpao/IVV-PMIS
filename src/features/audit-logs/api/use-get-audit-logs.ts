import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

import { AuditEntityType } from '../types';

interface UseGetAuditLogsProps {
  workspaceId: string;
  entityId?: string;
  entityType?: AuditEntityType;
}

export const useGetAuditLogs = ({ workspaceId, entityId, entityType }: UseGetAuditLogsProps) => {
  const query = useQuery({
    queryKey: ['audit-logs', workspaceId, entityId, entityType],
    queryFn: async () => {
      const response = await client.api['audit-logs'].$get({
        query: {
          workspaceId,
          entityId,
          entityType: entityType?.toString(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
