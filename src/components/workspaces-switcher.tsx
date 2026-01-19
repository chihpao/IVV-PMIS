'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const t = useTranslations('Nav');

  const { open } = useCreateWorkspaceModal();
  const { data: workspaces } = useGetWorkspaces();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={onSelect} value={workspaceId ?? ''}>
        <SelectTrigger className="w-auto border-none bg-transparent p-0 font-medium text-[var(--text-primary)] shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&>svg]:hidden">
          <SelectValue placeholder={t('noWorkspaceSelected')} />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id} className="cursor-pointer">
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
          <div
            onClick={open}
            className="flex cursor-pointer items-center gap-3 px-2 py-2 font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] relative select-none rounded-sm bg-transparent outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <RiAddCircleFill className="size-5" />
            <span className="truncate">{t('createWorkspace')}</span>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};
