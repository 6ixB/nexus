import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

  const finishInteractionMutation = useMutation({
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

  return (
    <div className="w-full space-y-4">
      <div className="w-full text-center">
        <span className="font-medium">Regenera</span> wants to access your
        account
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-y-2">
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
        <ul className="list-disc list-inside font-light">
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
      <div className="w-full flex items-center gap-x-4">
        <Button
          onClick={async () => {
            await finishInteractionMutation.mutateAsync();
          }}
          className="w-full"
        >
          Grant Access
        </Button>
        <Button variant="outline" className="w-full">
          Deny
        </Button>
      </div>
    </div>
  );
}
