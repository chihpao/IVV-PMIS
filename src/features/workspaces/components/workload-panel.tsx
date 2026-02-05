'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { useGetWorkspaceWorkload } from '@/features/workspaces/api/use-get-workspace-workload';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

// Threshold for overload
const OVERLOAD_THRESHOLD = 10;

export const WorkloadPanel = () => {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workload, isLoading } = useGetWorkspaceWorkload({ workspaceId });

  if (isLoading) {
    return (
      <Card className="h-full rounded-none border-[var(--border-strong)] shadow-none">
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-none border-[var(--border-strong)] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">{t('workload')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <DottedSeparator className="mb-4" />

        <div className="space-y-1">
          {workload?.map((item: any) => {
            const isOverloaded = item.openCount >= OVERLOAD_THRESHOLD;
            const isUnassigned = item.memberId === 'unassigned';

            return (
              <div
                key={item.memberId}
                onClick={() => {
                  router.push(`/workspaces/${workspaceId}/tasks?assigneeId=${item.memberId}`);
                }}
                className="group flex cursor-pointer items-center justify-between gap-x-4 border-b border-[var(--border-subtle)] py-3 transition hover:bg-muted/30 last:border-0"
              >
                <div className="flex min-w-0 items-center gap-x-3">
                  {isUnassigned ? (
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserPlus className="size-5" />
                    </div>
                  ) : (
                    <MemberAvatar name={item.name} className="size-10 shrink-0 rounded-full" fallbackClassName="rounded-full" />
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{isUnassigned ? t('unassigned') : item.name}</p>
                    {item.nextDueTask && (
                      <p className="truncate text-xs text-muted-foreground">
                        {t('nextDue')}: <span className="font-medium text-[var(--text-primary)]">{item.nextDueTask.name}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-x-2">
                      {isOverloaded && (
                        <div className="flex items-center gap-x-1 rounded-none bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                          <AlertCircle className="size-3" />
                          {t('overload')}
                        </div>
                      )}
                      <span className={cn('text-lg font-bold', isOverloaded ? 'text-red-600' : 'text-[var(--text-primary)]')}>
                        {item.openCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
