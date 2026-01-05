'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
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
          <svg viewBox="0 0 24 24" className="size-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18 6-6-6-6" />
          </svg>
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

        <Sidebar isCollapsed={false} />
      </SheetContent>
    </Sheet>
  );
};
