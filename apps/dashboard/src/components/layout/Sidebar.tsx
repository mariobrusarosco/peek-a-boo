'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Flag,
  Home,
  Settings,
  User,
  Users,
  LineChart,
  Server,
  LayoutDashboard,
} from 'lucide-react';

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Feature Flags',
    href: '/flags',
    icon: <Flag className="h-5 w-5" />,
  },
  {
    title: 'Environments',
    href: '/environments',
    icon: <Server className="h-5 w-5" />,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: 'Audit Logs',
    href: '/audit',
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    title: 'Team',
    href: '/team',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold text-indigo-600">Peek-a-boo</span>
        </Link>
        <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">Beta</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarNavItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === item.href && 'bg-muted font-semibold text-primary'
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 