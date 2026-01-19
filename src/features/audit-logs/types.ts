import { Models } from 'node-appwrite';

import { Member } from '@/features/members/types';

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

export enum AuditEntityType {
    TASK = 'TASK',
    PROJECT = 'PROJECT',
    WORKSPACE = 'WORKSPACE',
}

export type AuditLog = Models.Document & {
    action: AuditAction;
    entityId: string;
    entityType: AuditEntityType;
    entityTitle: string;
    userId: string;
    userName: string;
    userImage?: string;
    workspaceId: string;
    author?: Member; // To populate if needed, though we store name snapshot
};
