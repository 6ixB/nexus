'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Nexus from '@/components/vector-graphics/nexus';
import SignInForm from '@/components/pages/auth/signin/signin-form';
import SignInConsentScreen from '@/components/pages/auth/signin/signin-consent-screen';
import { ModeToggle } from '@/components/base/mode-toggle';
import { LoadingSpinner } from '@/components/base/loading-spinner';
import { Suspense } from 'react';

export function SignInPageComponent() {
  const searchParams = useSearchParams();
  const interactionUid = searchParams.get('interactionUid');

  const { data: interaction, isFetching } = useQuery({
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
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  console.log('Interaction Details: ', interaction);

  return (
    <main className="container my-8 w-full">
      <Card className="mx-auto max-w-md border-0 shadow-none md:border md:shadow-sm  md:p-4">
        <CardHeader>
          <div className="w-full flex justify-between">
            <CardTitle>
              <Link
                href="/"
                className="inline-flex select-none items-center gap-x-4"
              >
                <Nexus className="mb-2 h-12 w-9" />
                Nexus
              </Link>
            </CardTitle>
            <ModeToggle />
          </div>
          <CardDescription>Sign In</CardDescription>
        </CardHeader>
        <CardContent className="min-h-16">
          {interactionUid && isFetching ? (
            <LoadingSpinner className="text-black dark:text-white size-6 mx-auto" />
          ) : interaction?.prompt?.name === 'consent' ? (
            <SignInConsentScreen interactionUid={interactionUid} />
          ) : (
            <SignInForm interactionUid={interactionUid} />
          )}
        </CardContent>
        <CardFooter className="block">
          {(!interaction || interaction?.prompt?.name === 'login') && (
            <div className="mb-4">
              <p className="text-sm font-light">Don&apos;t have an account?</p>
              <Link
                href="/auth/signup"
                className="select-none text-sm text-blue-500 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
          <p className="text-xs text-gray-400">
            Copyright © 2024 Nexus Labs Inc.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <LoadingSpinner className="text-black dark:text-white size-6 mx-auto" />
      }
    >
      {SignInPageComponent()}
    </Suspense>
  );
}
