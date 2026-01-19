'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { RiAddCircleFill, RiArrowRightSLine } from 'react-icons/ri';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const t = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  
  // useLocalStorage returns [value, setValue, remove], we stick to isOpen, setIsOpen naming
  const [isOpenStored, setIsOpenStored] = useLocalStorage('projects-expanded', true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch: render 'true' (expanded) on server/initial client to match HTML
  // After mount, switch to stored value.
  const isOpen = isMounted ? (isOpenStored ?? true) : true;
  const setIsOpen = setIsOpenStored;

  const { open } = useCreateProjectModal();
  const { data: projects } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="stagger-fade flex flex-col gap-y-2">
      <div 
        className="flex cursor-pointer items-center gap-2.5 rounded-none p-2.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between">
            <span className="truncate">{t('projects')}</span>
            <RiArrowRightSLine className={cn("size-4 transition-transform", isOpen && "rotate-90")} />
        </div>
      </div>

      {isOpen && (
        <>
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
          
          <div
             onClick={open}
             className="flex cursor-pointer items-center gap-2.5 rounded-none p-2.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
             <RiAddCircleFill className="size-5" />
             <span className="truncate">{tCommon('create')}</span>
          </div>
        </>
      )}
    </div>
  );
};
