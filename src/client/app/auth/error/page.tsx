'use client';

import { LoadingSpinner } from '@/components/base/loading-spinner';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import base64url from 'base64url';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import Nexus from '@/components/vector-graphics/nexus';
import { ModeToggle } from '@/components/base/mode-toggle';
import { AlertCircle } from 'lucide-react';

function AuthErrorPageComponent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const error = errorParam ? JSON.parse(base64url.decode(errorParam)) : null;

  console.log(error);

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
        </CardHeader>
        <CardContent className="min-h-16">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error ? error.name : 'Error'}</AlertTitle>
            <AlertDescription>
              {error
                ? error.error_description
                : 'Oops... something went wrong!'}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="block">
          <div className="mb-4">
            <p className="text-sm font-light">Don&apos;t have an account?</p>
            <Link
              href="/auth/signup"
              className="select-none text-sm text-blue-500 hover:text-blue-600"
            >
              Sign Up
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            Copyright © 2024 Nexus Labs Inc.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <LoadingSpinner className="text-black dark:text-white size-6 mx-auto" />
      }
    >
      {<AuthErrorPageComponent />}
    </Suspense>
  );
}
