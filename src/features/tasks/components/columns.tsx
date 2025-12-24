'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import type { _Translator as Translator } from 'use-intl/core';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import type { Task } from '@/features/tasks/types';
import { TaskStatus } from '@/features/tasks/types';

import { TaskActions } from './task-actions';
import { TaskDate } from './task-date';

export const createColumns = (tTasks: Translator, tCommon: Translator): ColumnDef<Task>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {tTasks('taskName')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: 'project',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {tTasks('project')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;

      if (!project) {
        return <p className="text-sm text-muted-foreground">{tCommon('noProject')}</p>;
      }

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar className="size-6" name={project.name} image={project.imageUrl} />

          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    id: 'assignee',
    accessorFn: (row) => row.assignee?.name ?? '',
    sortingFn: 'alphanumeric',
    sortUndefined: 'last',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {tTasks('assignee')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      if (!assignee) {
        return <p className="text-sm text-muted-foreground">{tCommon('unassigned')}</p>;
      }

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar fallbackClassName="text-xs" className="size-6" name={assignee.name} />

          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {tTasks('dueDate')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {tTasks('status')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const statusLabels: Record<TaskStatus, string> = {
        [TaskStatus.BACKLOG]: tTasks('statusBacklog'),
        [TaskStatus.TODO]: tTasks('statusTodo'),
        [TaskStatus.IN_PROGRESS]: tTasks('statusInProgress'),
        [TaskStatus.IN_REVIEW]: tTasks('statusInReview'),
        [TaskStatus.DONE]: tTasks('statusDone'),
      };

      return <Badge variant={status}>{statusLabels[status]}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
