'use client';

import { useTranslations } from 'next-intl';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

import { CreateWorkspaceForm } from './create-workspace-form';

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
  const tWorkspaces = useTranslations('Workspaces');

  return (
    <ResponsiveModal
      title={tWorkspaces('createWorkspace')}
      description={tWorkspaces('createWorkspaceDescription')}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
