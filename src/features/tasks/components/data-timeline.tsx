'use client';

import { Gantt, Task as GanttTask, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import type { Task } from '@/features/tasks/types';
import { TaskStatus } from '@/features/tasks/types';

import './data-timeline.css';

interface DataTimelineProps {
  data: Task[];
}

export const DataTimeline = ({ data }: DataTimelineProps) => {
  const { mutate: updateTask } = useUpdateTask();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const t = useTranslations('Tasks'); // Reuse Tasks translations or create new if needed

  const tasks: GanttTask[] = useMemo(() => {
    return data.map((task) => {
      const start = new Date(task.dueDate);
      const end = new Date(task.dueDate);
      end.setDate(end.getDate() + 1); // Default 1 day for single date tasks

      let barBackgroundColor = '#d4d4d8'; // default zinc-300 (Backlog)
      if (task.status === TaskStatus.IN_PROGRESS)
        barBackgroundColor = '#3b82f6'; // blue-500
      else if (task.status === TaskStatus.IN_REVIEW)
        barBackgroundColor = '#eab308'; // yellow-500
      else if (task.status === TaskStatus.DONE) barBackgroundColor = '#22c55e'; // green-500

      // Match text colors from theme
      const styles = {
        backgroundColor: barBackgroundColor,
        backgroundSelectedColor: barBackgroundColor,
        progressColor: barBackgroundColor,
        progressSelectedColor: barBackgroundColor,
      };

      return {
        start: start,
        end: end,
        name: task.name,
        id: task.$id,
        type: 'task',
        progress: task.status === TaskStatus.DONE ? 100 : 0,
        isDisabled: false,
        styles: styles,
      };
    });
  }, [data]);

  const handleDateChange = (task: GanttTask) => {
    updateTask({
      json: { dueDate: task.start },
      param: { taskId: task.id },
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-end gap-x-2">
        <Button onClick={() => setViewMode(ViewMode.Day)} variant={viewMode === ViewMode.Day ? 'primary' : 'outline'} size="sm">
          Day
        </Button>
        <Button onClick={() => setViewMode(ViewMode.Week)} variant={viewMode === ViewMode.Week ? 'primary' : 'outline'} size="sm">
          Week
        </Button>
        <Button onClick={() => setViewMode(ViewMode.Month)} variant={viewMode === ViewMode.Month ? 'primary' : 'outline'} size="sm">
          Month
        </Button>
      </div>
      <div className="flex-1 overflow-hidden rounded-md border text-xs shadow-sm">
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onDateChange={handleDateChange}
          columnWidth={viewMode === ViewMode.Month ? 150 : 60}
          listCellWidth=""
          barCornerRadius={4}
          barFill={60}
          fontFamily="inherit"
          /* Styling Overrides */
          headerHeight={50}
          rowHeight={50}
          /* Colors passed as props where possible, but CSS overrides do most work */
          arrowColor="var(--text-tertiary)"
          arrowIndent={20}
        />
      </div>
    </div>
  );
};
