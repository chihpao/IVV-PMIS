import { redirect } from 'next/navigation';

import { EditUserForm } from '@/features/auth/components/edit-user-form';
import { getCurrent } from '@/features/auth/queries';

const SettingsPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div className="w-full lg:max-w-xl">
      <EditUserForm />
    </div>
  );
};

export default SettingsPage;
