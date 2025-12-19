import { useParams } from 'next/navigation';

export const useWorkspaceId = () => {
  const params = useParams();

  const workspaceId = params.workspaceId;

  if (Array.isArray(workspaceId)) return workspaceId[0] ?? '';

  return typeof workspaceId === 'string' ? workspaceId : '';
};
