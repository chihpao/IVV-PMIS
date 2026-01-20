'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Briefcase, CheckCircle2, ChevronRight, Command, Plus, Search, Settings, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useGetSearch } from '@/features/search/api/use-get-search';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCommandPalette } from '@/hooks/use-command-palette';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

export const CommandPalette = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { isOpen, setIsOpen } = useCommandPalette();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { open: openProjectModal } = useCreateProjectModal();
  const { open: openTaskModal } = useCreateTaskModal();

  const { data, isLoading } = useGetSearch({
    workspaceId,
    search: debouncedSearch,
  });

  const projects = data?.projects || [];
  const tasks = data?.tasks || [];

  const quickActions = [
    {
      id: 'create-project',
      label: '建立新專案',
      icon: Plus,
      onClick: () => {
        openProjectModal();
        setIsOpen(false);
      },
    },
    {
      id: 'create-task',
      label: '建立新任務',
      icon: CheckCircle2,
      onClick: () => {
        openTaskModal();
        setIsOpen(false);
      },
    },
    {
      id: 'manage-members',
      label: '管理成員',
      icon: Users,
      onClick: () => {
        router.push(`/workspaces/${workspaceId}/members`);
        setIsOpen(false);
      },
    },
    {
      id: 'settings',
      label: '工作空間設定',
      icon: Settings,
      onClick: () => {
        router.push(`/workspaces/${workspaceId}/settings`);
        setIsOpen(false);
      },
    },
  ];

  const results = [
    ...quickActions.map((a) => ({ ...a, type: 'action' })),
    ...projects.map((p) => ({ id: p.$id, label: p.name, type: 'project', imageUrl: p.imageUrl })),
    ...tasks.map((t) => ({ id: t.$id, label: t.name, type: 'task' })),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const handleSelect = (item: any) => {
    if (item.type === 'action') {
      item.onClick();
    } else if (item.type === 'project') {
      router.push(`/workspaces/${workspaceId}/projects/${item.id}`);
      setIsOpen(false);
    } else if (item.type === 'task') {
      router.push(`/workspaces/${workspaceId}/tasks/${item.id}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DialogContent
          hideClose
          noOverlay
          className="!fixed !top-[12vh] !left-1/2 !-translate-x-1/2 !translate-y-0 max-w-2xl overflow-hidden p-0 outline-none data-[state=open]:!slide-in-from-top-4 data-[state=open]:!slide-in-from-left-1/2 data-[state=closed]:!slide-out-to-top-4 data-[state=closed]:!slide-out-to-left-1/2 shadow-2xl"
        >
          <VisuallyHidden>
            <DialogTitle>全域快捷啟動器</DialogTitle>
            <DialogDescription>快速搜尋專案、任務或執行指令</DialogDescription>
          </VisuallyHidden>

          <div className="flex flex-col">
            {/* Input Area */}
            <div className="flex items-center border-b border-[var(--border-subtle)] px-4 h-16">
              <Search className="mr-3 h-5 w-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="搜尋或輸入指令... (ESC 關閉)"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex w-full bg-transparent py-3 text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              />
              <div className="flex items-center gap-1.5 ml-4">
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-2 font-mono text-[10px] font-medium text-[var(--text-secondary)]">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[450px] overflow-y-auto p-2 scrollbar-thin">
              {isLoading && <div className="px-4 py-8 text-center text-sm text-[var(--text-tertiary)]">正在搜尋中...</div>}

              {!isLoading && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[var(--text-tertiary)]">找不到相關結果。</div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="space-y-4">
                  {/* Results Groups */}
                  {quickActions.length > 0 && search.length === 0 && (
                    <div>
                      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">快捷指令</div>
                      {quickActions.map((action, index) => (
                        <CommandItem
                          key={action.id}
                          label={action.label}
                          icon={action.icon}
                          isActive={selectedIndex === index}
                          onClick={() => handleSelect({ ...action, type: 'action' })}
                          onMouseEnter={() => setSelectedIndex(index)}
                        />
                      ))}
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">專案</div>
                      {projects.map((project, index) => {
                        const globalIndex = (search.length === 0 ? quickActions.length : 0) + index;
                        return (
                          <CommandItem
                            key={project.$id}
                            label={project.name}
                            type="project"
                            imageUrl={project.imageUrl}
                            isActive={selectedIndex === globalIndex}
                            onClick={() => handleSelect({ ...project, id: project.$id, type: 'project' })}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          />
                        );
                      })}
                    </div>
                  )}

                  {tasks.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">任務</div>
                      {tasks.map((task, index) => {
                        const globalIndex = (search.length === 0 ? quickActions.length : 0) + projects.length + index;
                        return (
                          <CommandItem
                            key={task.$id}
                            label={task.name}
                            type="task"
                            isActive={selectedIndex === globalIndex}
                            onClick={() => handleSelect({ ...task, id: task.$id, type: 'task' })}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 px-4 py-3 text-[11px] text-[var(--text-tertiary)]">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1 font-mono">↑↓</kbd> 選擇
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1 font-mono">ENTER</kbd> 確認
                </span>
              </div>
              <span className="flex items-center gap-1">
                按 <kbd className="rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1 font-mono">⌘K</kbd> 呼叫
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Backdrop to avoid layout shift from modal scrollbar-hiding */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

interface CommandItemProps {
  label: string;
  icon?: any;
  type?: 'project' | 'task' | 'action';
  imageUrl?: string;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

const CommandItem = ({ label, icon: Icon, type, imageUrl, isActive, onClick, onMouseEnter }: CommandItemProps) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        'group flex cursor-pointer select-none items-center justify-between rounded-none px-3 py-2.5 transition-colors',
        isActive ? 'bg-[var(--accent-subtle)]' : 'hover:bg-[var(--bg-hover)]',
      )}
    >
      <div className="flex items-center gap-3">
        {type === 'project' ? (
          <ProjectAvatar name={label} image={imageUrl} className="size-6" fallbackClassName="text-[10px]" />
        ) : type === 'task' ? (
          <div className="flex h-6 w-6 items-center justify-center bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <CheckCircle2 className="size-3.5 text-[var(--text-tertiary)]" />
          </div>
        ) : Icon ? (
          <div className="flex h-6 w-6 items-center justify-center bg-[var(--accent-muted)] border border-[var(--accent-subtle)]">
            <Icon className="size-3.5 text-[var(--accent-primary)]" />
          </div>
        ) : (
          <div className="size-6 bg-red-500" />
        )}
        <span
          className={cn(
            'text-sm font-medium truncate max-w-[400px]',
            isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
          )}
        >
          {label}
        </span>
      </div>
      {isActive && <ChevronRight className="size-4 text-[var(--accent-primary)] animate-in fade-in slide-in-from-left-1" />}
    </div>
  );
};
