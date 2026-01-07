'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const t = useTranslations('Nav');

  const { open } = useCreateProjectModal();
  const { data: projects } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2 stagger-fade">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">{t('projects')}</p>

        <button onClick={open}>
          <RiAddCircleFill className="size-5 cursor-pointer text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-primary)]" />
        </button>
      </div>

      {projects?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-none p-2.5 text-[var(--text-secondary)] transition-colors',
                isActive
                  ? 'bg-[var(--accent-subtle)] text-[var(--text-primary)] shadow-sm'
                  : 'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
              )}
            >
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
