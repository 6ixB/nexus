'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui-custom/loading-spinner';
import { useRouter } from 'next/navigation';

type SignOutFormProps = {
  xsrf: string;
};

export default function SignOutForm({ xsrf }: SignOutFormProps) {
  const form = useForm<{ xsrf: string }>({
    defaultValues: {
      xsrf: xsrf,
    },
  });

  const router = useRouter();

  const {
    mutateAsync: signOutMutateAsync,
    isPending: signOutMutationIsPending,
  } = useMutation({
    mutationFn: async (postLogoutRedirectUri: string | undefined) => {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      return postLogoutRedirectUri;
    },
    onSuccess: (postLogoutRedirectUri: string | undefined) => {
      if (postLogoutRedirectUri) {
        router.push(postLogoutRedirectUri);
        return;
      }

      router.push('/auth/signout/success');
    },
    onError: (error) => {
      form.setError('xsrf', {
        type: 'manual',
        message: error.message,
      });
    },
  });

  const {
    mutateAsync: endSessionMutateAsync,
    isPending: endSessionMutationIsPending,
  } = useMutation({
    mutationFn: async (xsrf: string) => {
      const urlEncodedData = new URLSearchParams();

      urlEncodedData.append('xsrf', xsrf);
      urlEncodedData.append('logout', 'yes');

      const res = await fetch('/api/oidc/session/end/confirm', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData,
      });

      return res.url;
    },
    onSuccess: async (postLogoutRedirectUri: string | undefined) => {
      await signOutMutateAsync(postLogoutRedirectUri);
    },
    onError: (error) => {
      form.setError('root', {
        type: 'manual',
        message: error.message,
      });
    },
  });

  async function onSubmit(values: { xsrf: string }) {
    try {
      const { xsrf } = values;

      await endSessionMutateAsync(xsrf);
    } catch (error) {
      form.setError('xsrf', {
        type: 'manual',
        message: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          Do you want to sign-out from&nbsp;
          <span className="font-medium">Nexus</span>?
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Confirmation needed</AlertTitle>
            <AlertDescription>
              Your session will be terminated and you will be signed out from
              Nexus.
            </AlertDescription>
          </Alert>
        </div>
        <FormField
          control={form.control}
          name="xsrf"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" name="xsrf" value={xsrf} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center gap-x-4">
          <Button
            autoFocus={true}
            type="submit"
            variant="outline"
            className="w-full"
          >
            {endSessionMutationIsPending || signOutMutationIsPending ? (
              <LoadingSpinner className="size-6 text-black dark:text-white" />
            ) : (
              'Yes'
            )}
          </Button>
          <Button
            type="button"
            onClick={() => {
              router.push('/');
            }}
            className="w-full"
          >
            No
          </Button>
        </div>
      </form>
    </Form>
  );
}
