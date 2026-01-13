'use server';

import { redirect } from 'next/navigation';
import { OAuthProvider } from 'node-appwrite';

import { createAdminClient } from '@/lib/appwrite';

export async function onOAuth(provider: OAuthProvider.Github | OAuthProvider.Google, next?: string) {
  const { account } = await createAdminClient();

  const origin = process.env.NEXT_PUBLIC_APP_BASE_URL;

  const redirectUrl = await account.createOAuth2Token(
    provider,
    `${origin}/api/auth?next=${encodeURIComponent(next ?? '')}`,
    `${origin}/sign-in`
  );

  return redirect(redirectUrl);
}
