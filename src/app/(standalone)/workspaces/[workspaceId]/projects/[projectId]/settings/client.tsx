'use client';

import { useTranslations } from 'next-intl';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { useProjectId } from '@/features/projects/hooks/use-project-id';

export const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const tErrors = useTranslations('Errors');
  const { data: initialValues, isLoading } = useGetProject({ projectId });

  if (isLoading) return <PageLoader />;
  if (!initialValues) return <PageError message={tErrors('projectNotFound')} />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
