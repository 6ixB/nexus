'use client';

import type {
  AuthInteraction,
  AuthSignIn,
  Interaction,
} from '@/lib/schema/auth.schema';
import {
  AuthInteractionDtoSchema,
  AuthSignInSchema,
} from '@/lib/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
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
import { LoadingSpinner } from '@/components/ui-custom/loading-spinner';
import { ApiRoute } from 'src/api/api.routes';

type SignInFormProps = {
  interaction: Interaction;
};

export default function SignInForm({ interaction }: SignInFormProps) {
  const form = useForm<z.infer<typeof AuthSignInSchema>>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const {
    mutateAsync: signInInteractionMutateAsync,
    isPending: signInInteractionMutationIsPending,
  } = useMutation({
    mutationFn: async (authInteractionDto: AuthInteraction) => {
      const response = await fetch(
        `/api/auth/interactions/${interaction.jti}/signin`,
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

  const { mutateAsync: signInMutateAsync, isPending: signInMutationIsPending } =
    useMutation({
      mutationFn: async (authSignInDto: AuthSignIn) => {
        const response = await fetch(`/${ApiRoute.AUTH}/signin`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authSignInDto),
        });

        const data = await response.json();

        return data;
      },
      onSuccess: async (data) => {
        const { email } = data;

        const authInteractionDto = AuthInteractionDtoSchema.parse({
          login: {
            accountId: email,
            amr: ['pwd'],
          },
        });

        await signInInteractionMutateAsync(authInteractionDto);
      },
      onError: (error) => {
        form.setError('root', {
          type: 'manual',
          message: error.message,
        });
      },
    });

  async function onSubmit(values: z.infer<typeof AuthSignInSchema>) {
    try {
      const authSignInDto = AuthSignInSchema.parse(values);

      await signInMutateAsync(authSignInDto);
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
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
        <Button type="submit" className="w-full text-base">
          {signInMutationIsPending || signInInteractionMutationIsPending ? (
            <LoadingSpinner className="size-6" />
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  );
}
