import Link from 'next/link';
import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/base/admin-panel/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Nexus from '@/components/vector-graphics/nexus';

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link
              href="/dashboard"
              className="flex justify-start items-center gap-2"
            >
              <Nexus className="w-6 h-6 mr-1" />
              <h1 className="font-bold text-lg">Nexus</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}