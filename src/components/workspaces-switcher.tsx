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
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">{t('workspaces')}</p>
        <button onClick={open}>
          <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
        </button>
      </div>

      <Select onValueChange={onSelect} value={workspaceId ?? ''}>
      <SelectTrigger className="w-full border-none bg-white p-1 font-medium shadow-none">
          <SelectValue placeholder={t('noWorkspaceSelected')} />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id} className="data-[state=checked]:bg-white">
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />

                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
