'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Analytics } from '@/components/analytics';
import { DottedSeparator } from '@/components/dotted-separator';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import type { Member } from '@/features/members/types';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import type { Project } from '@/features/projects/types';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import type { Task } from '@/features/tasks/types';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const tErrors = useTranslations('Errors');

  const { data: workspaceAnalytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId, limit: 4 });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingTasks || isLoadingProjects || isLoadingMembers;

  if (isLoading) return <PageLoader />;
  if (!tasks || !projects || !members) return <PageError message={tErrors('failedToLoadWorkspace')} />;

  return (
    <div className="flex h-full flex-col space-y-4">
      {workspaceAnalytics ? (
        <Analytics data={workspaceAnalytics} />
      ) : (
        <div className="h-[72px] w-full rounded-lg border bg-muted/50" aria-busy={isLoadingAnalytics} />
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList data={tasks.documents.slice(0, 4)} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();
  const tHome = useTranslations('Home');

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{tHome('tasksWithCount', { count: total })}</p>

          <Button title={tHome('createTask')} variant="muted" size="icon" onClick={() => createTask()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        <div className="my-4 h-px bg-[var(--border-subtle)]" />

        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="p-4">
                    <p className="truncate text-lg font-medium">{task.name}</p>

                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>

                      <div aria-hidden className="size-1 rounded-full bg-neutral-300" />

                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 size-3" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate), { locale: zhTW })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">{tHome('noTasks')}</li>
        </ul>

        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>{tHome('showAll')}</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();
  const tHome = useTranslations('Home');

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{tHome('projectsWithCount', { count: total })}</p>

          <Button title={tHome('createProject')} variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        <div className="my-4 h-px bg-[var(--border-subtle)]" />

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectAvatar name={project.name} image={project.imageUrl} className="size-12" fallbackClassName="text-lg" />
                    <p className="truncate text-lg font-medium">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">{tHome('noProjects')}</li>
        </ul>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
  total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceId();
  const tHome = useTranslations('Home');

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{tHome('membersWithCount', { count: total })}</p>

          <Button title={tHome('manageMembers')} variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>

        <div className="my-4 h-px bg-[var(--border-subtle)]" />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col items-center gap-x-2 p-3">
                  <MemberAvatar name={member.name} className="size-12" />

                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="line-clamp-1 text-lg font-medium">{member.name.slice(0, 15)}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{member.email.slice(0, 20)}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}

          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">{tHome('noMembers')}</li>
        </ul>
      </div>
    </div>
  );
};
