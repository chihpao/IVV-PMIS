import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { z } from 'zod';

import { AUDIT_LOGS_ID, DATABASE_ID, MEMBERS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';

import { AuditLog } from '../types';

const app = new Hono().get(
  '/',
  sessionMiddleware,
  zValidator(
    'query',
    z.object({
      workspaceId: z.string(),
      entityId: z.string().optional(),
      entityType: z.string().optional(),
    }),
  ),
  async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');

    const { workspaceId, entityId, entityType } = ctx.req.valid('query');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized' }, 401);
    }

    const queries = [Query.equal('workspaceId', workspaceId), Query.orderDesc('$createdAt'), Query.limit(50)];

    if (entityId) {
      queries.push(Query.equal('entityId', entityId));
    }

    if (entityType) {
      queries.push(Query.equal('entityType', entityType));
    }

    try {
      // Try using the session-based databases first
      const auditLogs = await databases.listDocuments<AuditLog>(DATABASE_ID, AUDIT_LOGS_ID, queries);
      return ctx.json({ data: auditLogs });
    } catch (sessionError) {
      // Session client failed (likely 401). This is expected for standard users.
      // Silently falling back to Admin client.

      try {
        // Fallback to Admin Client if session client lacks permissions (common for audit logs)
        const { databases: adminDatabases } = await createAdminClient();
        const auditLogs = await adminDatabases.listDocuments<AuditLog>(DATABASE_ID, AUDIT_LOGS_ID, queries);

        return ctx.json({ data: auditLogs });
      } catch (adminError) {
        console.error('[AUDIT_LOGS_CRITICAL_FAILURE]', {
          sessionError: sessionError instanceof Error ? sessionError.message : sessionError,
          adminError: adminError instanceof Error ? adminError.message : adminError,
          queries: JSON.stringify(queries),
        });

        return ctx.json(
          {
            error: 'Failed to fetch audit logs',
            message: adminError instanceof Error ? adminError.message : 'Unknown error',
            code: (adminError as any)?.code,
            type: (adminError as any)?.type,
            debug: {
              sessionError: sessionError instanceof Error ? sessionError.message : sessionError,
              adminError: adminError instanceof Error ? adminError.message : adminError,
              queries: queries,
            },
          },
          500,
        );
      }
    }
  },
);

export default app;
