import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignInForm from '@/components/pages/auth/signin/SignInForm';
import Link from 'next/link';
import Nexus from '@/components/vector-graphics/Nexus';

export default function SignInPage() {
  return (
    <main className="container my-8 w-full">
      <Card className="mx-auto max-w-md border-0 md:border md:p-4">
        <CardHeader>
          <CardTitle>
            <Link
              href="/"
              className="inline-flex select-none items-center gap-x-4"
            >
              <Nexus className="mb-2 h-12 w-9" />
              Nexus
            </Link>
          </CardTitle>
          <CardDescription>Sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="block">
          <div className="mb-4">
            <p className="text-sm font-light">Don&apos;t have an account?</p>
            <Link
              href="/auth/signup"
              className="select-none text-sm text-blue-500 hover:text-blue-600"
            >
              Sign up
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