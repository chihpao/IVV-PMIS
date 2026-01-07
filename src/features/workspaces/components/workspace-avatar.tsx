import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({ image, name, className }: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div className={cn('relative size-10 overflow-hidden rounded-none', className)}>
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-10 rounded-none', className)}>
      <AvatarFallback className="rounded-none bg-[var(--accent-subtle)] text-lg font-semibold uppercase text-[var(--accent-primary)]">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
