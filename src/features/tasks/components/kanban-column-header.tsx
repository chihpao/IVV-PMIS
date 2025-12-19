import { Circle, CircleCheck, CircleDashed, CircleDot, CircleDotDashed, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { TaskStatus } from '@/features/tasks/types';

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashed className="size-[18px] text-pink-400" />,
  [TaskStatus.TODO]: <Circle className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashed className="size-[18px] text-yellow-400" />,
  [TaskStatus.IN_REVIEW]: <CircleDot className="size-[18px] text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheck className="size-[18px] text-emerald-400" />,
};

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const tTasks = useTranslations('Tasks');
  const icon = statusIconMap[board];
  const statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: tTasks('statusBacklog'),
    [TaskStatus.TODO]: tTasks('statusTodo'),
    [TaskStatus.IN_PROGRESS]: tTasks('statusInProgress'),
    [TaskStatus.IN_REVIEW]: tTasks('statusInReview'),
    [TaskStatus.DONE]: tTasks('statusDone'),
  };

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{statusLabels[board]}</h2>

        <div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </div>
      </div>

      <Button
        onClick={() => open(board)}
        variant="ghost"
        size="icon"
        className="size-5"
        title={tTasks('createTaskWithStatus', { status: statusLabels[board] })}
      >
        <Plus className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
