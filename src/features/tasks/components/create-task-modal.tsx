'use client';

import { useTranslations } from 'next-intl';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';

import { CreateTaskFormWrapper } from './create-task-form-wrapper';

export const CreateTaskModal = () => {
  const { isOpen, initialStatus, close } = useCreateTaskModal();
  const tTasks = useTranslations('Tasks');

  return (
    <ResponsiveModal title={tTasks('createTask')} description={tTasks('createTaskDescription')} open={isOpen} onOpenChange={close}>
      <CreateTaskFormWrapper initialStatus={initialStatus} onCancel={close} />
    </ResponsiveModal>
  );
};
