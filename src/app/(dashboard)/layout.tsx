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
          className={[
            'w-full transition-[padding-left] duration-200 ease-out',
            isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[264px]',
          ].join(' ')}
        >
          <div className="mx-auto h-full max-w-screen-xl px-4 pb-8 lg:px-6">
            <Navbar />

            <main className="mt-6 flex h-full flex-col rounded-3xl bg-white/80 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)] ring-1 ring-border/60 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
