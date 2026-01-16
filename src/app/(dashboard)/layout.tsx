import { cookies } from 'next/headers';
import type { PropsWithChildren } from 'react';

import { DashboardLayout } from './dashboard-layout';

const Layout = ({ children }: PropsWithChildren) => {
  const cookieStore = cookies();
  const defaultCollapsed = cookieStore.get('sidebar-collapsed')?.value === 'true';

  return <DashboardLayout defaultCollapsed={defaultCollapsed}>{children}</DashboardLayout>;
};

export default Layout;
