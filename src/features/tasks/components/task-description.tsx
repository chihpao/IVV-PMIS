import { Pencil, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { DottedSeparator } from '@/components/dotted-separator';
import { MarkdownToolbar } from '@/components/markdown-toolbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import type { Task } from '@/features/tasks/types';

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const tCommon = useTranslations('Common');
  const tTasks = useTranslations('Tasks');
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: editTask, isPending } = useUpdateTask();

  const handleSave = () => {
    editTask(
      {
        json: {
          description: value,
        },
        param: {
          taskId: task.$id,
        },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleMarkdownAction = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.substring(start, end);

    const replacement = `${prefix}${selection}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    setValue(newValue);

    // After state update, we need to focus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selection.length);
    }, 0);
  };

  return (
    <div className="rounded-none border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{tTasks('description')}</p>

        <Button
          onClick={() => {
            setValue(task.description || '');
            setIsEditing((prevIsEditing) => !prevIsEditing);
          }}
          size="sm"
          variant="secondary"
        >
          {isEditing ? <XIcon className="mr-2 size-4" /> : <Pencil className="mr-2 size-4" />}
          {isEditing ? tCommon('cancel') : tCommon('edit')}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="edit"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                編輯
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                預覽
              </TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-4 flex flex-col gap-y-2">
              <MarkdownToolbar onAction={handleMarkdownAction} disabled={isPending} />
              <Textarea
                ref={textareaRef}
                autoFocus
                placeholder={tTasks('addDescription')}
                value={value}
                rows={12}
                onChange={(e) => setValue(e.target.value)}
                disabled={isPending}
                className="font-mono text-sm resize-none rounded-t-none border-t-0 focus-visible:ring-0"
              />
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="font-bold">Pro-tip:</span>
                <span>支援 Markdown 語法與鍵盤快捷鍵</span>
              </p>
            </TabsContent>
            <TabsContent value="preview" className="mt-4 min-h-[200px] border rounded-md p-4 bg-neutral-50/30">
              {value ? (
                <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                </div>
              ) : (
                <span className="italic text-muted-foreground">沒有內容</span>
              )}
            </TabsContent>
          </Tabs>

          <Button size="sm" className="ml-auto w-fit" onClick={handleSave} disabled={isPending}>
            {isPending ? tTasks('saving') : tTasks('saveChanges')}
          </Button>
        </div>
      ) : (
        <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert">
          {task.description ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.description}</ReactMarkdown>
          ) : (
            <span className="italic text-muted-foreground">{tTasks('noDescription')}</span>
          )}
        </div>
      )}
    </div>
  );
};
