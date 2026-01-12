import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/sonner';

import { getMemberFromCache, getProjectFromCache, taskMatchesFilters, updateTaskLists } from '@/features/tasks/api/task-cache';
import type { Task } from '@/features/tasks/types';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$patch']>;
type MutationContext = {
  previousTasks: Array<[QueryKey, unknown]>;
  previousTask?: Task;
};

export const useUpdateTask = () => {
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
    onMutate: async ({ json, param }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', param.taskId] });

      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });
      const previousTask = queryClient.getQueryData<Task>(['task', param.taskId]);

      const updates: Partial<Task> = {};

      if (typeof json.name === 'string') updates.name = json.name;
      if (json.status) updates.status = json.status;
      if (typeof json.projectId === 'string') updates.projectId = json.projectId;
      if (json.dueDate) updates.dueDate = json.dueDate instanceof Date ? json.dueDate.toISOString() : json.dueDate;
      if (typeof json.assigneeId === 'string') updates.assigneeId = json.assigneeId;
      if (typeof json.description === 'string') updates.description = json.description;

      updateTaskLists(queryClient, (data, filters) => {
        const index = data.documents.findIndex((task) => task.$id === param.taskId);
        if (index === -1) return data;

        const currentTask = data.documents[index];
        const mergedTask = hydrateTask({
          ...currentTask,
          ...updates,
          project: updates.projectId ? getProjectFromCache(queryClient, currentTask.workspaceId, updates.projectId) : currentTask.project,
          assignee: updates.assigneeId
            ? getMemberFromCache(queryClient, currentTask.workspaceId, updates.assigneeId)
            : currentTask.assignee,
        });

        if (!taskMatchesFilters(mergedTask, filters)) {
          const nextDocuments = data.documents.filter((task) => task.$id !== param.taskId);
          const total = typeof data.total === 'number' ? Math.max(0, data.total - 1) : nextDocuments.length;

          return {
            ...data,
            documents: nextDocuments,
            total,
          };
        }

        const nextDocuments = [...data.documents];
        nextDocuments[index] = mergedTask;

        return {
          ...data,
          documents: nextDocuments,
        };
      });

      queryClient.setQueryData(['task', param.taskId], (current) => {
        if (!current || typeof current !== 'object') return current;
        const currentTask = current as Task;
        return hydrateTask({
          ...currentTask,
          ...updates,
          project: updates.projectId ? getProjectFromCache(queryClient, currentTask.workspaceId, updates.projectId) : currentTask.project,
          assignee: updates.assigneeId
            ? getMemberFromCache(queryClient, currentTask.workspaceId, updates.assigneeId)
            : currentTask.assignee,
        });
      });

      return { previousTasks, previousTask };
    },
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId']['$patch']({ json, param });

      if (!response.ok) throw new Error(t('taskUpdateFailed'));

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(t('taskUpdated'));

      const hydratedTask = hydrateTask(data as Task);

      updateTaskLists(queryClient, (currentData, filters) => {
        const index = currentData.documents.findIndex((task) => task.$id === hydratedTask.$id);

        if (index === -1 && taskMatchesFilters(hydratedTask, filters)) {
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

        if (index === -1) return currentData;

        const nextDocuments = [...currentData.documents];
        nextDocuments[index] = {
          ...nextDocuments[index],
          ...hydratedTask,
        };

        return {
          ...currentData,
          documents: nextDocuments,
        };
      });

      queryClient.setQueryData(['task', hydratedTask.$id], (current) => {
        if (!current || typeof current !== 'object') return hydratedTask;
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
      console.error('[UPDATE_TASK]: ', error);

      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousTask) {
        queryClient.setQueryData(['task', context.previousTask.$id], context.previousTask);
      }

      toast.error(t('taskUpdateFailed'));
    },
  });

  return mutation;
};
