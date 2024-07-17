import { AuthSignInDtoSchema } from '@/lib/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type SignInFormProps = {
  interactionUid: string | undefined;
};

export default function SignInForm({ interactionUid }: SignInFormProps) {
  const form = useForm<z.infer<typeof AuthSignInDtoSchema>>({
    resolver: zodResolver(AuthSignInDtoSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const { mutateAsync: signInMutateAsync, isPending: signInMutationIsPending } =
    useMutation({
      mutationFn: async (authInteractionDto: any) => {
        const response = await fetch(
          `/auth/interactions/${interactionUid}/signin`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(authInteractionDto),
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
        form.setError('root', {
          type: 'manual',
          message: error.message,
        });
      },
    });

  async function onSubmit(values: z.infer<typeof AuthSignInDtoSchema>) {
    const { email } = values;

    // TODO: Implement actual authentication logic

    if (!interactionUid) {
      // TODO: Implement non-delegated authorization sign-in
      return;
    }

    const authInteractionDto = {
      login: {
        accountId: email,
      },
    };

    await signInMutateAsync(authInteractionDto);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  className="rouded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="rouded-md"
                />
              </FormControl>
              <FormMessage />
              <div className="py-2">
                <Link
                  href="/auth/forgot-password"
                  className="select-none text-sm text-blue-500 hover:text-blue-600"
                >
                  Forgot password?
                </Link>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 text-base text-white hover:bg-blue-600"
        >
          {signInMutationIsPending ? (
            <LoadingSpinner className="text-white size-6" />
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  );
}
