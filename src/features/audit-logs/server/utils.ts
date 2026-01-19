import { Databases, ID } from 'node-appwrite';

import { AUDIT_LOGS_ID, DATABASE_ID } from '@/config/db';
import { AuditAction, AuditEntityType } from '../types';

interface LogAuditProps {
    databases: Databases;
    workspaceId: string;
    action: AuditAction;
    entityId: string;
    entityType: AuditEntityType;
    entityTitle: string;
    user: { $id: string; name: string; email?: string }; // Minimum user info
    member?: { name: string }; // Optional member name if different
}

export const logAudit = async ({
    databases,
    workspaceId,
    action,
    entityId,
    entityType,
    entityTitle,
    user,
}: LogAuditProps) => {
    try {
        await databases.createDocument(
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
                // userImage: ... if available
            }
        );
    } catch (error) {
        console.error('[AUDIT_LOG_ERROR]', error);
        // We don't throw, to avoid blocking the main action
    }
};
