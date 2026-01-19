import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, MEMBERS_ID } from '@/config/db';
import { AUTH_COOKIE } from '@/features/auth/constants';
import { signInFormSchema, signUpFormSchema, updateUserSchema } from '@/features/auth/schema';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        userId: z.string().trim().min(1),
        secret: z.string().trim().min(1),
        next: z.string().optional(),
      }),
    ),
    async (ctx) => {
      const { userId, secret, next } = ctx.req.valid('query');

      const { account } = await createAdminClient();
      const session = await account.createSession(userId, secret);

      setCookie(ctx, AUTH_COOKIE, session.secret, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
      });

      let redirectUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

      if (next && next.length > 0) {
        redirectUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}${next.startsWith('/') ? next : `/${next}`}`;
      }

      return ctx.redirect(redirectUrl);
    },
  )
  .get('/current', sessionMiddleware, (ctx) => {
    const user = ctx.get('user');

    return ctx.json({ data: user });
  })
  .post('/login', zValidator('json', signInFormSchema), async (ctx) => {
    const { email, password } = ctx.req.valid('json');

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return ctx.json({ success: true });
  })
  .post('/register', zValidator('json', signUpFormSchema), async (ctx) => {
    const { name, email, password } = ctx.req.valid('json');

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return ctx.json({ success: true });
  })
  .post('/logout', sessionMiddleware, async (ctx) => {
    const account = ctx.get('account');

    deleteCookie(ctx, AUTH_COOKIE);
    await account.deleteSession('current');

    return ctx.json({ success: true });
  })
  .patch('/current', sessionMiddleware, zValidator('json', updateUserSchema), async (ctx) => {
    const { name } = ctx.req.valid('json');
    const account = ctx.get('account');
    const user = ctx.get('user');

    if (name) {
        await account.updateName(name);

        // Sync name to all member records using Admin Client to bypass permissions
        const { databases } = await createAdminClient();

        const members = await databases.listDocuments(
            DATABASE_ID, 
            MEMBERS_ID, 
            [Query.equal('userId', user.$id)]
        );

        if (members.total > 0) {
            await Promise.all(
                members.documents.map((member) => 
                    databases.updateDocument(
                        DATABASE_ID,
                        MEMBERS_ID,
                        member.$id,
                        { name }
                    )
                )
            );
        }
    }

    const updatedUser = await account.get(); // Fetch updated user
    return ctx.json({ data: updatedUser });
  });

export default app;
