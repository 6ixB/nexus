import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Nexus from '@/components/vector-graphics/nexus';
import { ModeToggle } from '@/components/ui-custom/mode-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export default function SignOutSuccessPageComponent() {
  return (
    <main className="container my-8 w-full">
      <Card className="mx-auto max-w-md border-0 shadow-none md:border md:p-4 md:shadow-sm">
        <CardHeader>
          <div className="flex w-full justify-between">
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
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Sign-out success</AlertTitle>
            <AlertDescription>
              You have been signed out from Nexus.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="block">
          <p className="text-xs text-gray-400">
            Copyright © 2024 Nexus Labs Inc.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
