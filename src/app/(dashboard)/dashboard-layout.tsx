'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { Suspense, useEffect, useRef, useState } from 'react';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

const ModalProvider = dynamic(() => import('@/components/modal-provider').then((mod) => mod.ModalProvider), {
  ssr: false,
});

interface DashboardLayoutProps extends PropsWithChildren {
  defaultCollapsed: boolean;
}

export const DashboardLayout = ({ children, defaultCollapsed }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }

    const checkMobile = () => {
      // Auto-collapse when browser is large (per user request) or very small (to save space)
      if (window.innerWidth >= 1024 || window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      document.cookie = `sidebar-collapsed=${newState}; path=/; max-age=31536000; SameSite=Lax`;
      return newState;
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-base)] p-[16px]">
      <ModalProvider />

      <div className="flex h-[calc(100vh-32px)] w-full gap-4">
        {/* Sidebar Island */}
        <aside
          className="relative flex-shrink-0 rounded-none bg-[var(--bg-base)] transition-[width] duration-200 ease-out"
          style={{ width: isSidebarCollapsed ? 72 : 220 }}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        </aside>

        {/* Main Content Island */}
        <main className="flex flex-1 flex-col overflow-hidden rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
          <div ref={mainContentRef} className="custom-scrollbar flex-1 overflow-y-auto">
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
