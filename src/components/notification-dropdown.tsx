'use client';

import { Bell, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAuditLogs } from '@/features/audit-logs/api/use-get-audit-logs';
import { ActivityCard } from '@/features/audit-logs/components/activity-card';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const NotificationDropdown = () => {
  const workspaceId = useWorkspaceId();
  const { data: auditLogs, isLoading } = useGetAuditLogs({
    workspaceId,
  });

  if (!workspaceId) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative size-8 rounded-full border-none shadow-none">
          <Bell className="size-4 text-neutral-500" />
          {/* Optional: Add red dot if new notifications */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-none shadow-none">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-medium">通知</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !auditLogs?.documents.length ? (
              <div className="p-4 text-center text-sm text-neutral-500">沒有新的通知。</div>
            ) : (
              <ScrollArea className="h-80">
                <div className="flex flex-col">
                  {auditLogs.documents.map((log) => (
                    <div key={log.$id} className="border-b last:border-none">
                      <ActivityCard data={log} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
