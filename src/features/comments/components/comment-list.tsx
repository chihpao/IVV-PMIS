import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComment } from '@/features/comments/api/use-create-comment';
import { useGetComments } from '@/features/comments/api/use-get-comments';
import { CommentItem } from '@/features/comments/components/comment-item';

interface CommentListProps {
  taskId: string;
  workspaceId: string;
}

export const CommentList = ({ taskId, workspaceId }: CommentListProps) => {
  const [content, setContent] = useState('');
  const t = useTranslations('Common');

  const { data: comments, isLoading } = useGetComments({ taskId, workspaceId });
  const { mutate: createComment, isPending } = useCreateComment();

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;

    createComment(
      {
        json: {
          content,
          taskId,
          workspaceId,
        },
      },
      {
        onSuccess: () => {
          setContent('');
          // Optional: Scroll to bottom
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 rounded-none border p-4">
      <p className="text-lg font-semibold">討論區</p>

      <div className="flex flex-col gap-y-6 max-h-[400px] overflow-y-auto pr-2">
        {comments?.documents.map((comment: any) => (
          <CommentItem key={comment.$id} comment={comment} />
        ))}

        {comments?.total === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">目前沒有留言，成為第一個留言的人吧！</div>
        )}
      </div>

      <div className="flex flex-col gap-y-2 mt-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="輸入留言..."
          className="resize-none"
          rows={3}
          disabled={isPending}
        />
        <Button onClick={handleSubmit} className="w-fit ml-auto" size="sm" disabled={isPending || !content.trim()}>
          {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          傳送
        </Button>
      </div>
    </div>
  );
};
