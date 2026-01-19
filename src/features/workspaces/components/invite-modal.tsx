'use client';

import { Copy, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useResetInviteCode } from '@/features/workspaces/api/use-reset-invite-code';
import { useInviteModal } from '@/features/workspaces/hooks/use-invite-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { toast } from '@/lib/sonner';

export const InviteModal = () => {
  const { isOpen, setIsOpen, close } = useInviteModal();
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useGetWorkspace({ workspaceId });
  const { mutate, isPending } = useResetInviteCode();

  const t = useTranslations('Common'); // Or Members/Workspace namespace if available

  const inviteUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/workspaces/${workspaceId}/join/${workspace?.inviteCode}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('邀請連結已複製');
  };

  const handleReset = () => {
    mutate({ param: { workspaceId } });
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen} title="邀請新成員" description="分享連結以邀請成員">
      <Card className="w-full border-none shadow-none">
        <CardHeader className="p-7">
          <CardTitle className="text-xl font-bold">邀請新成員</CardTitle>
          <CardDescription>分享下方連結來邀請成員加入此工作空間。</CardDescription>
        </CardHeader>
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2">
              <Input className="uppercase font-mono" value={inviteUrl} readOnly />
              <Button onClick={handleCopy} variant="secondary" className="size-12">
                <Copy className="size-5" />
              </Button>
            </div>
            <Button disabled={isPending} onClick={handleReset} variant="outline" className="w-full mt-4">
              重置邀請連結 (舊連結將失效)
              <RefreshCw className="size-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
