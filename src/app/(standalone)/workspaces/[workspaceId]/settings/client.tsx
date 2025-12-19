'use client';

import { useTranslations } from 'next-intl';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const tErrors = useTranslations('Errors');

  const { data: initialValues, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) return <PageLoader />;

  if (!initialValues) return <PageError message={tErrors('workspaceNotFound')} />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
