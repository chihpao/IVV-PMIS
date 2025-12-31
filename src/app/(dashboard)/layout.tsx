'use client';

import type { PropsWithChildren } from 'react';
import { Suspense, useState } from 'react';

import { ModalProvider } from '@/components/modal-provider';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-[16px] overflow-hidden">
      <ModalProvider />

      <div className="flex gap-[12px] h-[calc(100vh-32px)] w-full">
        {/* Sidebar Island */}
        <aside
          className="
            relative hidden lg:block
            bg-[var(--bg-surface)] 
            rounded-[12px] 
            border border-[var(--border-default)]
            shadow-card
            overflow-hidden
            flex-shrink-0
            transition-[width] duration-200 ease-out
          "
          style={{ width: isSidebarCollapsed ? 72 : 264 }}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((prev) => !prev)} />
        </aside>

        {/* Main Content Island */}
        <main
          className="
          flex-1 
          bg-[var(--bg-surface)] 
          rounded-[12px] 
          border border-[var(--border-default)]
          shadow-card
          overflow-hidden
          flex flex-col
        "
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar">
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
