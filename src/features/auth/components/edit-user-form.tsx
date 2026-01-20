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

export const EditUserForm = () => {
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const tAuth = useTranslations('Auth');
  const tValidation = useTranslations('Validation');

  const { data: user } = useCurrent();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      password: '',
      oldPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    updateUser({
      json: values,
    });
  };

  if (!user) return null;

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">{tNav('account')}</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                disabled={isPending}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tAuth('fullNamePlaceholder')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={tAuth('fullNamePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-y-4 rounded-none border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 p-4">
                <p className="text-sm font-medium">變更密碼 (選填)</p>
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>目前密碼</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="若要變更密碼，請輸入目前密碼" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新密碼</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="輸入新密碼" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-end">
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
