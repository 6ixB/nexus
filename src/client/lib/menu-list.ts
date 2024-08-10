import type { LucideIcon } from 'lucide-react';
import {
  LayoutGrid,
  SquareUserRound,
  Shield,
  LockKeyhole,
  MonitorSmartphone,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: 'Dashboard',
          active: pathname.includes('/'),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Account',
      menus: [
        {
          href: '/personal-info',
          label: 'Personal Info',
          active: pathname.includes('/personal-info'),
          icon: SquareUserRound,
          submenus: [],
        },
        {
          href: '/security',
          label: 'Security',
          active: pathname.includes('/security'),
          icon: Shield,
          submenus: [
            {
              href: '/security/data',
              label: 'Data',
              active: pathname === '/security/data',
            },
            {
              href: 'security/activity',
              label: 'Activity',
              active: pathname === '/security/activity',
            },
          ],
        },
        {
          href: '/privacy',
          label: 'Privacy',
          active: pathname.includes('/privacy'),
          icon: LockKeyhole,
          submenus: [],
        },
        {
          href: '/devices',
          label: 'Devices',
          active: pathname.includes('/devices'),
          icon: MonitorSmartphone,
          submenus: [],
        },
      ],
    },
  ];
}
