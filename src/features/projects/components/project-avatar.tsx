import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({ image, name, className, fallbackClassName }: ProjectAvatarProps) => {
  if (image) {
    return (
      <div className={cn('relative size-5 overflow-hidden rounded-none', className)}>
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-5 rounded-none', className)}>
      <AvatarFallback
        className={cn(
          'rounded-none bg-[var(--accent-subtle)] text-sm font-semibold uppercase text-[var(--accent-primary)]',
          fallbackClassName,
        )}
      >
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
