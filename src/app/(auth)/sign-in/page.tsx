import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { SignInCard } from '@/features/auth/components/sign-in-card';
import { getCurrent } from '@/features/auth/queries';

const SignInPage = async () => {
  const user = await getCurrent();

  if (user) redirect('/');

  return (
    <Suspense>
      <SignInCard />
    </Suspense>
  );
};

export default SignInPage;
