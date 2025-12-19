'use server';

import { type Models, Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/db';
import { createSessionClient } from '@/lib/appwrite';
import { getFileViewUrl } from '@/lib/appwrite-file-url';

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);

    if (members.total === 0) return { documents: [], total: 0 };

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.contains('$id', workspaceIds),
      Query.orderDesc('$createdAt'),
    ]);

    const workspacesWithImages: Models.Document[] = workspaces.documents.map((workspace) => ({
      ...workspace,
      imageUrl: workspace.imageId ? getFileViewUrl(workspace.imageId) : undefined,
    }));

    return {
      documents: workspacesWithImages,
      total: workspaces.total,
    };
  } catch {
    return { documents: [], total: 0 };
  }
};
