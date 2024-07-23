import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/base/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type SignInConsentScreenProps = {
  interactionUid: string | undefined;
};

export default function SignInConsentScreen({
  interactionUid,
}: SignInConsentScreenProps) {
  const router = useRouter();

  const {
    mutateAsync: confirmMutateAsync,
    isPending: confirmMutationIsPending,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/auth/interactions/${interactionUid}/confirm`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
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
          `/auth/interactions/${interactionUid}/abort`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
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
        <span className="font-medium">Regenera</span> wants to access your
        account
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-y-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="font-medium">john.doe@example.com</span>
      </div>
      <Separator />
      <div>
        <div>
          This will allow <span className="font-medium">Regenera</span> to
          access the following information:
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
        <div className="font-medium">Make sure you trust Regenera</div>
        <p className="font-light">
          You may be sharing sensitive data with this site or app.
        </p>
      </div>
      <Separator />
      <div className="flex w-full items-center gap-x-4">
        <Button
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
