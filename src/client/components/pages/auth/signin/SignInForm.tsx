'use client';

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
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export function SignInFormComponent() {
  const searchParams = useSearchParams();
  const interactionUid = searchParams.get('interactionUid');

  const interaction = useQuery({
    queryKey: [interactionUid],
    queryFn: async () => {
      const res = await fetch(`/auth/interactions/${interactionUid}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      return data;
    },
    enabled: !!interactionUid,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  console.log('Interaction Details: ', interaction.data);

  const form = useForm<z.infer<typeof AuthSignInDtoSchema>>({
    resolver: zodResolver(AuthSignInDtoSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof AuthSignInDtoSchema>) {
    const { email } = values;

    await fetch(`/auth/interactions/${interactionUid}/finish`, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: email,
      }),
    });
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
          Sign in
        </Button>
      </form>
    </Form>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={<div>Signin Fallback Component</div>}>
      <SignInFormComponent />
    </Suspense>
  );
}
