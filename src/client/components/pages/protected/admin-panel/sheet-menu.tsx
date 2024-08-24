import Link from 'next/link';
import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/pages/protected/admin-panel/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import Nexus from '@/components/vector-graphics/nexus';
import { ClientRoute } from '@/client.routes';

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button
            className="flex items-center justify-start pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link
              href={ClientRoute.HOME}
              className="flex items-center justify-start gap-2"
            >
              <Nexus className="mr-1 h-6 w-6" />
              <SheetTitle className="text-lg font-bold">Nexus</SheetTitle>
              <SheetDescription>
                <VisuallyHidden.Root>
                  A Simple Identity Provider and OpenID Connect Authorization
                  Server for your applications
                </VisuallyHidden.Root>
              </SheetDescription>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
