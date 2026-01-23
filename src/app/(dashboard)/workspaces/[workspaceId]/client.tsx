'use client';

import { useTranslations } from 'next-intl';

import { Analytics } from '@/components/analytics';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { ActionQueuePanel } from '@/features/workspaces/components/action-queue-panel';
import { ActivityFeed } from '@/features/workspaces/components/activity-feed';
import { WorkloadPanel } from '@/features/workspaces/components/workload-panel';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const tErrors = useTranslations('Errors');

  const { data: workspaceAnalytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });

  // Note: We no longer need to check tasks/projects/members here at the top level
  // as the panels handle their own data fetching internally for better performance
  // and isolated loading states.

  if (isLoadingAnalytics) return <PageLoader />;
  if (!workspaceAnalytics) return <PageError message={tErrors('failedToLoadWorkspace')} />;

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-y-4">
          <ActionQueuePanel />
        </div>
        <div className="flex flex-col gap-y-4">
          <WorkloadPanel />
        </div>
      </div>

      <div className="mt-4">
        <ActivityFeed />
      </div>
    </div>
  );
};
