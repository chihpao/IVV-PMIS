import { Cross2Icon } from '@radix-ui/react-icons';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useTranslations } from 'next-intl';
import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useMedia } from 'react-use';

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';

interface ResponsiveModalProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({ children, title, description, open, onOpenChange }: PropsWithChildren<ResponsiveModalProps>) => {
  const isDesktop = useMedia('(min-width: 1024px)', true);
  const tCommon = useTranslations('Common');

  if (isDesktop) {
    if (!open) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999]">
        <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
        <div className="fixed left-1/2 top-[10%] z-[10000] w-[90vw] max-w-lg -translate-x-1/2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0 shadow-modal max-h-[85vh] overflow-y-auto">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-none opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
          >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">{tCommon('close')}</span>
          </button>
          <VisuallyHidden.Root>
            <h2>{title}</h2>

            <p>{description}</p>
          </VisuallyHidden.Root>
          {children}
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHidden.Root>
          <DrawerTitle>{title}</DrawerTitle>

          <DrawerDescription>{description}</DrawerDescription>
        </VisuallyHidden.Root>
        <div className="hide-scrollbar max-h-[calc(100vh-8rem)] overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
