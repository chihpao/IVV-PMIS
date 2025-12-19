'use client';

import { useTranslations } from 'next-intl';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';

import { EditTaskFormWrapper } from './edit-task-form-wrapper';

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();
  const tTasks = useTranslations('Tasks');

  return (
    <ResponsiveModal title={tTasks('editTask')} description={tTasks('editTaskDescription')} open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
