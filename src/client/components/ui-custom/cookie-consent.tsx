'use client';

import { CookieIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const close = () => {
    setIsOpen(false);
    document.cookie = '_cookie_consent=true; path=/';
    setTimeout(() => {
      setHide(true);
    }, 700);
  };

  useEffect(() => {
    try {
      setIsOpen(true);
      if (document.cookie.includes('_cookie_consent=true')) {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[200] w-full duration-700 sm:bottom-4 sm:left-4 sm:max-w-md',
        !isOpen
          ? 'translate-y-8 opacity-0 transition-[opacity,transform]'
          : 'translate-y-0 opacity-100 transition-[opacity,transform]',
        hide && 'hidden',
      )}
    >
      <div className="m-3 rounded-md border border-border bg-background shadow-lg dark:bg-card">
        <div className="grid gap-2">
          <div className="flex h-14 items-center justify-between border-b border-border p-4">
            <h1 className="text-lg font-medium">We use cookies</h1>
            <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
          </div>
          <div className="space-y-2 px-4 pb-6 pt-4">
            <p className="text-start text-sm font-normal">
              By continuing to use this site you consent to the use of cookies
              in accordance with our&nbsp;
              <span className="underline">cookie policy</span>.
            </p>
            <p className="text-left text-sm text-muted-foreground">
              We use cookies to ensure you get the best experience on our
              website.
            </p>
          </div>
          <div className="flex gap-2 border-t border-border p-4 py-5 dark:bg-background/20">
            <Button onClick={close} className="w-full">
              I understand and want to continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
