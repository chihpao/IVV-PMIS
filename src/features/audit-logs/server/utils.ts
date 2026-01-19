import { ID } from 'node-appwrite';

import { createAdminClient } from '@/lib/appwrite';

import { AUDIT_LOGS_ID, DATABASE_ID } from '@/config/db';
import { AuditAction, AuditEntityType } from '../types';

interface LogAuditProps {
    workspaceId: string;
    action: AuditAction;
    entityId: string;
    entityType: AuditEntityType;
    entityTitle: string;
    user: { $id: string; name: string; email?: string; prefs?: { image?: string } }; // Minimum user info
    member?: { name: string }; // Optional member name if different
}

export const logAudit = async ({
    workspaceId,
    action,
    entityId,
    entityType,
    entityTitle,
    user,
}: LogAuditProps) => {
    try {
        const { databases: adminDatabases } = await createAdminClient();
        await adminDatabases.createDocument(
            DATABASE_ID,
            AUDIT_LOGS_ID,
            ID.unique(),
            {
                workspaceId,
                action,
                entityId,
                entityType,
                entityTitle,
                userId: user.$id,
                userName: user.name, // Snapshot name at time of action
                userImage: user.prefs?.image as string | undefined,
            }
        );
    } catch (error) {
        console.error('[AUDIT_LOG_ERROR]', error);
        // We don't throw, to avoid blocking the main action
    }
};
