import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { WorkspaceIdJoinClient } from './client';

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/workspaces/${params.workspaceId}/join/${params.inviteCode}`)}`);
  }

  return <WorkspaceIdJoinClient />;
};

export default WorkspaceIdJoinPage;
