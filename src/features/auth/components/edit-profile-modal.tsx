'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { EditProfileForm } from '@/features/auth/components/edit-profile-form';
import { useEditProfileModal } from '@/features/auth/hooks/use-edit-profile-modal';

export const EditProfileModal = () => {
  const { isOpen, setIsOpen, close } = useEditProfileModal();

  return (
    <ResponsiveModal title="個人資料設定" description="在這裡更新您的個人基本資訊。" open={isOpen} onOpenChange={setIsOpen}>
      <EditProfileForm onCancel={close} />
    </ResponsiveModal>
  );
};
