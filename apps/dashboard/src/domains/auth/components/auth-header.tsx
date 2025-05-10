'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/domains/ui-system/components/ui/avatar';
import { Button } from '@/domains/ui-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/ui/dropdown-menu';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { SidebarTrigger } from '@/domains/ui-system/components/ui/sidebar';
import { ThemeToggle } from '@/domains/ui-system/components/theme-toggle';
import { Separator } from '@/domains/ui-system/components/ui/separator';

export default function Header({ className }: { className?: string }) {
  return (
    <header className={`border-b bg-background px-4 lg:px-6 ${className}`}>
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="User avatar" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Separator orientation="vertical" className="h-8 mx-2" />
          {/* <AuthUserNav /> */}
        </div>
      </div>
    </header>
  );
}