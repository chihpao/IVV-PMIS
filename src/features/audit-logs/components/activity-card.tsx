import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

import { MemberAvatar } from '@/features/members/components/member-avatar';

import { AuditAction, AuditLog } from '../types';

interface ActivityCardProps {
  data: AuditLog;
}

export const ActivityCard = ({ data }: ActivityCardProps) => {
  const isCreate = data.action === AuditAction.CREATE;
  const isUpdate = data.action === AuditAction.UPDATE;
  const isDelete = data.action === AuditAction.DELETE;

  let actionText = '執行了操作';
  if (isCreate) actionText = '建立了任務';
  if (isUpdate) actionText = '更新了任務';
  if (isDelete) actionText = '刪除任務';

  return (
    <div className="flex items-center gap-x-2">
      <MemberAvatar
        className="size-8"
        fallbackClassName="text-xs"
        name={data.userName}
      />
      <div className="flex flex-col">
        <p className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-900">{data.userName}</span>{' '}
          {actionText}
        </p>
        <p className="text-xs text-neutral-400">
          {formatDistanceToNow(new Date(data.$createdAt), {
            addSuffix: true,
            locale: zhTW,
          })}
        </p>
      </div>
    </div>
  );
};
