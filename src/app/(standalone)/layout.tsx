import type { PropsWithChildren } from 'react';

import { Logo } from '@/components/logo';
import { UserButton } from '@/features/auth/components/user-button';

const StandaloneLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-6 py-4">
        <nav className="flex h-[73px] items-center justify-between rounded-2xl bg-white/80 px-4 shadow-sm ring-1 ring-border/60 backdrop-blur">
          <Logo />

          <div className="flex items-center gap-x-2.5">
            <UserButton />
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center py-6">{children}</div>
      </div>
    </main>
  );
};
export default StandaloneLayout;
