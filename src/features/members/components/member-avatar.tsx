import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({ name, image, className, fallbackClassName }: MemberAvatarProps) => {
  return (
    <Avatar className={cn('size-5 rounded-none border border-neutral-300 transition', className)}>
      <AvatarImage src={image} className="object-cover" />
      <AvatarFallback
        className={cn('flex items-center justify-center rounded-none bg-neutral-200 font-medium text-neutral-500', fallbackClassName)}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
