'use client';

import { useTranslations } from 'next-intl';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';

import { CreateProjectForm } from './create-project-form';

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();
  const tProjects = useTranslations('Projects');

  return (
    <ResponsiveModal
      title={tProjects('createProject')}
      description={tProjects('createProjectDescription')}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
