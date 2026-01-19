import { Loader } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useGetAuditLogs } from '@/features/audit-logs/api/use-get-audit-logs';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { AuditEntityType } from '../types';
import { ActivityCard } from './activity-card';

interface ActivityListProps {
  entityId: string;
  entityType: AuditEntityType;
}

export const ActivityList = ({ entityId, entityType }: ActivityListProps) => {
  const workspaceId = useWorkspaceId();
  const { data: auditLogs, isLoading } = useGetAuditLogs({
    workspaceId,
    entityId,
    entityType,
  });

  if (isLoading) {
    return (
      <div className="flex h-14 items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!auditLogs?.documents.length) {
    return (
      <Card className="border-none shadow-none bg-muted">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          沒有活動紀錄。
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {auditLogs.documents.map((log) => (
        <ActivityCard key={log.$id} data={log} />
      ))}
    </div>
  );
};
