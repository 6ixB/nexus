import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignUpForm from '@/components/pages/auth/signup/signup-form';
import Link from 'next/link';
import Nexus from '@/components/vector-graphics/nexus';

export default function SignUpPage() {
  return (
    <main className="container my-8 w-full">
      <Card className="mx-auto max-w-md border-0 md:border md:p-4">
        <CardHeader>
          <div className="mb-4">
            <p className="text-sm font-light">Already have an account?</p>
            <Link
              href="/auth/signin"
              className="select-none text-sm text-blue-500 hover:text-blue-600"
            >
              Sign In
            </Link>
          </div>
          <CardTitle>
            <Link
              href="/"
              className="inline-flex select-none items-center gap-x-4"
            >
              <Nexus className="mb-2 h-12 w-9" />
              Nexus
            </Link>
          </CardTitle>
          <CardDescription>Sign Up</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-400">
            Copyright © 2024 Nexus Labs Inc.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
