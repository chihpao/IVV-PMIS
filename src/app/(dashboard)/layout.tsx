'use client';

import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { ModalProvider } from '@/components/modal-provider';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <ModalProvider />

      <div className="flex size-full">
        <div
          className={[
            'fixed left-0 top-0 z-50 hidden h-full overflow-visible transition-[width] duration-200 ease-out lg:block',
            isSidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[264px]',
          ].join(' ')}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((prev) => !prev)} />
        </div>

        <div
          className={['w-full transition-[padding-left] duration-200 ease-out', isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[264px]'].join(
            ' ',
          )}
        >
          <div className="mx-auto h-full max-w-screen-xl">
            <Navbar />

            <main className="flex h-full flex-col px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
