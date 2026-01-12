import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/sonner';

import { DATABASE_ID, TASKS_ID } from '@/config/db';
import {
  getMemberFromCache,
  getNextPositionFromCache,
  getProjectFromCache,
  taskMatchesFilters,
  updateTaskLists,
} from '@/features/tasks/api/task-cache';
import type { Task } from '@/features/tasks/types';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)['$post']>;
type MutationContext = {
  previousTasks: Array<[QueryKey, unknown]>;
  tempId: string;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Notifications');

  const hydrateTask = (task: Task) => {
    const project = task.project ?? getProjectFromCache(queryClient, task.workspaceId, task.projectId);
    const assignee = task.assignee ?? getMemberFromCache(queryClient, task.workspaceId, task.assigneeId);

    return {
      ...task,
      project: project ?? task.project,
      assignee: assignee ?? task.assignee,
    };
  };

  const mutation = useMutation<ResponseType, Error, RequestType, MutationContext>({
    onMutate: async ({ json }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', json.workspaceId] });

      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks', json.workspaceId] });
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      const dueDate = json.dueDate instanceof Date ? json.dueDate.toISOString() : json.dueDate;
      const position = getNextPositionFromCache(queryClient, json.workspaceId, json.status);

      const optimisticTask: Task = hydrateTask({
        $id: tempId,
        $sequence: 0,
        $collectionId: TASKS_ID,
        $databaseId: DATABASE_ID,
        $createdAt: now,
        $updatedAt: now,
        $permissions: [],
        name: json.name,
        status: json.status,
        assigneeId: json.assigneeId,
        projectId: json.projectId,
        workspaceId: json.workspaceId,
        position,
        dueDate,
        description: json.description,
      });

      updateTaskLists(queryClient, (data, filters) => {
        if (filters.workspaceId !== json.workspaceId) return data;
        if (!taskMatchesFilters(optimisticTask, filters)) return data;
        if (data.documents.some((task) => task.$id === optimisticTask.$id)) return data;

        const nextDocuments = [optimisticTask, ...data.documents];
        const limit = filters.limit ?? data.limit;
        const trimmedDocuments = typeof limit === 'number' ? nextDocuments.slice(0, limit) : nextDocuments;
        const total = typeof data.total === 'number' ? data.total + 1 : trimmedDocuments.length;

        return {
          ...data,
          documents: trimmedDocuments,
          total,
        };
      });

      return { previousTasks, tempId };
    },
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['$post']({ json });

      if (!response.ok) throw new Error(t('taskCreateFailed'));

      return await response.json();
    },
    onSuccess: ({ data }, _variables, context) => {
      toast.success(t('taskCreated'));

      const hydratedTask = hydrateTask(data);

      updateTaskLists(queryClient, (currentData, filters) => {
        if (filters.workspaceId !== hydratedTask.workspaceId) return currentData;
        const tempId = context?.tempId;
        const existingIndex = currentData.documents.findIndex((task) => task.$id === (tempId ?? hydratedTask.$id));
        const shouldInclude = taskMatchesFilters(hydratedTask, filters);

        if (existingIndex === -1 && shouldInclude) {
          const nextDocuments = [hydratedTask, ...currentData.documents];
          const limit = filters.limit ?? currentData.limit;
          const trimmedDocuments = typeof limit === 'number' ? nextDocuments.slice(0, limit) : nextDocuments;
          const total = typeof currentData.total === 'number' ? currentData.total + 1 : trimmedDocuments.length;

          return {
            ...currentData,
            documents: trimmedDocuments,
            total,
          };
        }

        if (existingIndex === -1) return currentData;

        const nextDocuments = [...currentData.documents];
        nextDocuments[existingIndex] = {
          ...nextDocuments[existingIndex],
          ...hydratedTask,
        };

        return {
          ...currentData,
          documents: nextDocuments,
        };
      });

      queryClient.setQueryData(['task', hydratedTask.$id], (current) => {
        if (!current) return hydratedTask;
        if (typeof current !== 'object') return hydratedTask;
        return {
          ...(current as Task),
          ...hydratedTask,
        };
      });

      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics', data.workspaceId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics', data.projectId],
        exact: true,
      });
    },
    onError: (error, _variables, context) => {
      console.error('[CREATE_TASK]: ', error);

      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error(t('taskCreateFailed'));
    },
  });

  return mutation;
};
