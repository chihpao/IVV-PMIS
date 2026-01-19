import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

import { MemberAvatar } from '@/features/members/components/member-avatar';
import { Comment } from '@/features/comments/types';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex gap-x-4">
      <MemberAvatar
        name={comment.author?.name || 'Unknown'}
        className="size-8"
        fallbackClassName="text-xs"
      />
      
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
            <span className="text-sm font-semibold">{comment.author?.name}</span>
            <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.$createdAt), { addSuffix: true, locale: zhTW })}
            </span>
        </div>
        <div className="text-sm text-neutral-600">
            {comment.content}
        </div>
      </div>
    </div>
  );
};
