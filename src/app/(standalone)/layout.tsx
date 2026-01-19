import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';

import { Logo } from '@/components/logo';

const UserButton = dynamic(() => import('@/features/auth/components/user-button').then((mod) => mod.UserButton), { ssr: false });

const StandaloneLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-screen-2xl px-6">
        <nav className="flex h-[73px] items-center justify-between">
          <Logo />

          <div className="flex items-center gap-x-2.5">
            <UserButton />
          </div>
        </nav>

        <div className="animate-fade-up flex flex-col items-center justify-center py-4">{children}</div>
      </div>
    </main>
  );
};
export default StandaloneLayout;
