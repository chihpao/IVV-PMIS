'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { ChevronDown, ChevronUp, History, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { useGetAuditLogs } from '@/features/audit-logs/api/use-get-audit-logs';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

export const ActivityFeed = () => {
  const t = useTranslations('Dashboard');
  const tAuth = useTranslations('Auth');
  const workspaceId = useWorkspaceId();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: auditLogs, isLoading } = useGetAuditLogs({
    workspaceId,
  });

  const logs = auditLogs?.documents || [];
  const latestLog = logs[0];

  return (
    <div className="rounded-none border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-none">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer items-center justify-between px-6 py-4 transition hover:bg-muted/50"
      >
        <div className="flex items-center gap-x-3">
          <History className="size-5 text-muted-foreground" />
          <span className="text-sm font-bold">{t('recentActivity')}</span>
          {latestLog && !isExpanded && (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {t('activityUpdated', {
                time: formatDistanceToNow(new Date(latestLog.$createdAt), { addSuffix: true, locale: zhTW }),
              })}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
      </div>

      {isExpanded && (
        <div className="border-t border-[var(--border-subtle)]">
          <div className="max-h-[400px] overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-[var(--border-subtle)]">
                {logs.map((log) => (
                  <div key={log.$id} className="relative flex items-start gap-x-4">
                    <MemberAvatar name={log.userName} image={log.userImage} className="z-10 size-9 border-4 border-[var(--bg-surface)]" />
                    <div className="min-w-0 pt-1">
                      <p className="text-sm">
                        <span className="font-bold">{log.userName}</span>
                        <span className="mx-1 text-muted-foreground">
                          {/* Simple mapping for minimal set as requested */}
                          {log.action === 'CREATE'
                            ? '建立了'
                            : log.action === 'UPDATE'
                              ? '更新了'
                              : log.action === 'DELETE'
                                ? '刪除了'
                                : log.action}
                        </span>
                        <span className="font-medium">{log.entityTitle}</span>
                      </p>
                      <p className="text-[10px] uppercase text-muted-foreground">
                        {formatDistanceToNow(new Date(log.$createdAt), { addSuffix: true, locale: zhTW })}
                      </p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-center text-sm text-muted-foreground">{t('noResults', { ns: 'Common' })}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
