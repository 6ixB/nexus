import SignInForm from '@/components/pages/auth/signin/signin-form';
import SignInConsentScreen from '@/components/pages/auth/signin/signin-consent-screen';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ModeToggle } from '@/components/ui-custom/mode-toggle';
import Nexus from '@/components/vector-graphics/nexus';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { serverApiAuthBaseUrl } from '@/client.constants';
import CookieConsent from '@/components/ui-custom/cookie-consent';

async function getInteraction(interactionUid: string) {
  const cookieValues = cookies()
    .getAll()
    .map((cookieObj) => `${cookieObj.name}=${cookieObj.value}`)
    .join('; ');

  try {
    const res = await fetch(
      `${serverApiAuthBaseUrl}/interactions/${interactionUid}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookieValues,
        },
      },
    );

    if (!res.ok) {
      return {};
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default async function SignInPage({
  params,
}: {
  params: { interactionUid: string };
}) {
  const { interactionUid } = params;
  const interaction = await getInteraction(interactionUid);

  return (
    <main className="container my-8 w-full">
      <CookieConsent />
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
          <CardDescription>Sign In</CardDescription>
        </CardHeader>
        <CardContent className="min-h-16">
          {interaction?.prompt?.name === 'consent' ? (
            <SignInConsentScreen interaction={interaction} />
          ) : (
            <SignInForm interaction={interaction} />
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
