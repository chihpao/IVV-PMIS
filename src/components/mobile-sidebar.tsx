'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Sidebar } from './sidebar';

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Nav');

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button title={tCommon('openMenu')} size="icon" variant="secondary" className="size-10 lg:hidden">
          <MenuIcon className="size-6 text-neutral-500" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>{tNav('mobileTitle')}</SheetTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <SheetDescription>{tNav('mobileDescription')}</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
