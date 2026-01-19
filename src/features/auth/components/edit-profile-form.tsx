'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCurrent } from '@/features/auth/api/use-current';
import { useUpdateUser } from '@/features/auth/api/use-update-user';
import { updateUserSchema } from '@/features/auth/schema';
import { cn } from '@/lib/utils';

// Add cn import if needed or use from utils

interface EditProfileFormProps {
  onCancel?: () => void;
}

export const EditProfileForm = ({ onCancel }: EditProfileFormProps) => {
  const tCommon = useTranslations('Common');
  const tAuth = useTranslations('Auth'); // Need to check if I have keys like 'editProfile' or I can reuse stuff.
  // I will assume simple keys or reuse for now.
  const { data: user } = useCurrent();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const editProfileForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    updateUser(
      {
        json: values,
      },
      {
        onSuccess: () => {
          onCancel?.();
        },
      },
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">個人資料設定</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...editProfileForm}>
          <form onSubmit={editProfileForm.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                disabled={isPending}
                control={editProfileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>

                    <FormControl>
                      <Input {...field} type="text" placeholder="輸入您的姓名" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>電子郵件</FormLabel>
                <FormControl>
                  <Input value={user?.email || ''} disabled type="text" />
                </FormControl>
              </FormItem>
              {/* Place for Job Title later if added */}
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                disabled={isPending}
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                className={cn(!onCancel && 'invisible')}
              >
                {tCommon('cancel')}
              </Button>

              <Button disabled={isPending} type="submit" size="lg">
                {tCommon('save')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
