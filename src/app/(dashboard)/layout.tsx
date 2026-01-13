'use client';

import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';
import { Suspense, useState } from 'react';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

const ModalProvider = dynamic(() => import('@/components/modal-provider').then((mod) => mod.ModalProvider), {
  ssr: false,
});

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-base)] p-[16px]">
      <ModalProvider />

      <div className="flex h-[calc(100vh-32px)] w-full gap-4">
        {/* Sidebar Island */}
        <aside
          className="relative hidden flex-shrink-0 rounded-none bg-[var(--bg-base)] transition-[width] duration-200 ease-out lg:block"
          style={{ width: isSidebarCollapsed ? 72 : 264 }}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((prev) => !prev)} />
        </aside>

        {/* Main Content Island */}
        <main className="flex flex-1 flex-col overflow-hidden rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <div className="sticky top-0 z-50 bg-[var(--bg-surface)]">
              <Suspense fallback={null}>
                <Navbar />
              </Suspense>
            </div>
            <div className="px-6 py-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
