'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui-custom/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { capitalizeFirstLetter, getUserInitials } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { Interaction } from '@/lib/schema/auth.schema';

type SignInConsentScreenProps = {
  interaction: Interaction;
};

export default function SignInConsentScreen({
  interaction,
}: SignInConsentScreenProps) {
  const router = useRouter();

  const {
    mutateAsync: confirmMutateAsync,
    isPending: confirmMutationIsPending,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/auth/interactions/${interaction.jti}/confirm`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      const data = await response.json();

      return data;
    },
    onSuccess: (data) => {
      const { redirectTo } = data;

      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutateAsync: abortMutateAsync, isPending: abortMutationIsPending } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(
          `/api/auth/interactions/${interaction.jti}/abort`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );

        const data = await response.json();

        return data;
      },
      onSuccess: (data) => {
        const { redirectTo } = data;

        if (redirectTo) {
          router.push(redirectTo);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });

  return (
    <div className="w-full space-y-4">
      <div className="w-full text-center">
        <span className="font-medium">
          {capitalizeFirstLetter(interaction.params.client_id)}
        </span>
        &nbsp;wants to access your account
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-y-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {interaction.lastSubmission?.extras
              ? getUserInitials(
                  (interaction.lastSubmission.extras as { name?: string }).name,
                )
              : ''}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{interaction.session.accountId}</span>
      </div>
      <Separator />
      <div>
        <div>
          This will allow&nbsp;
          <span className="font-medium">
            {capitalizeFirstLetter(interaction.params.client_id)}
          </span>
          &nbsp;to access the following information:
        </div>
        <ul className="list-inside list-disc font-light">
          <li>
            Access your <span className="font-normal">email address</span>
          </li>
          <li>
            Access your <span className="font-normal">profile information</span>
          </li>
          <li>
            Access your <span className="font-normal">account information</span>
          </li>
        </ul>
      </div>
      <Separator />
      <div>
        <div className="font-medium">
          Make sure you trust&nbsp;
          {capitalizeFirstLetter(interaction.params.client_id)}
        </div>
        <p className="font-light">
          You may be sharing sensitive data with this site or app.
        </p>
      </div>
      <Separator />
      <div className="flex w-full items-center gap-x-4">
        <Button
          autoFocus={true}
          onClick={async () => {
            await confirmMutateAsync();
          }}
          className="w-full"
        >
          {confirmMutationIsPending ? (
            <LoadingSpinner className="size-6 text-white dark:text-black" />
          ) : (
            'Grant'
          )}
        </Button>
        <Button
          onClick={async () => {
            await abortMutateAsync();
          }}
          variant="outline"
          className="w-full"
        >
          {abortMutationIsPending ? (
            <LoadingSpinner className="size-6 text-black dark:text-white" />
          ) : (
            'Deny'
          )}
        </Button>
      </div>
    </div>
  );
}
