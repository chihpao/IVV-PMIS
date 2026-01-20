'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/features/workspaces/api/use-delete-workspace';
import type { Workspace } from '@/features/workspaces/types';

interface DeleteWorkspaceDialogProps {
  initialValues: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteWorkspaceDialog = ({ initialValues, open, onOpenChange }: DeleteWorkspaceDialogProps) => {
  const tCommon = useTranslations('Common');
  const tWorkspaces = useTranslations('Workspaces');
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();

  const [confirmName, setConfirmName] = useState('');

  const handleDelete = () => {
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    );
  };

  const isConfirmDisabled = confirmName !== initialValues.name || isPending;

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={tWorkspaces('deleteWorkspace')}
      description={tWorkspaces('dangerZoneDescription')}
    >
      <Card className="size-full border-none shadow-none">
        <CardHeader className="p-7">
          <CardTitle className="text-xl font-bold text-destructive">{tWorkspaces('dangerZone')}</CardTitle>
          <CardDescription>{tWorkspaces('dangerZoneDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="p-7 pt-0">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <p className="text-sm font-medium">{tWorkspaces('deleteWorkspaceEnterName')}</p>
              <Input
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={tWorkspaces('deleteWorkspaceConfirmMatch', { name: initialValues.name })}
                disabled={isPending}
              />
            </div>

            <div className="flex w-full items-center justify-end gap-x-2">
              <Button onClick={() => onOpenChange(false)} variant="outline" disabled={isPending} className="w-full lg:w-auto">
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleDelete} variant="destructive" disabled={isConfirmDisabled} className="w-full lg:w-auto">
                {tCommon('delete')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
