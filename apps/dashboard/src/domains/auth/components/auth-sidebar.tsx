"use client";

import * as React from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/domains/ui-system/components/ui/sidebar';
import { LayoutDashboard, Folder, Flag, Settings, Users, Check, ChevronsUpDown } from 'lucide-react';
import { ComboboxDemo } from '@/domains/ui-system/components/ui/combobox';


export default function AuthSideBar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">P</span>
          {!isCollapsed && (
            <>
              <span className="text-lg font-semibold">eek-a-boo</span>
              <span className="text-xs bg-primary text-white px-2 py-1 rounded-md">beta</span>
            </>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Project Selector */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider text-muted-foreground">
            Projects
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <ComboboxDemo />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider text-muted-foreground">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
                    <LayoutDashboard className="h-5 w-5" />
                    {!isCollapsed && <span>Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/projects" className="flex items-center gap-2 px-2 py-1.5">
                    <Folder className="h-5 w-5" />
                    {!isCollapsed && <span>Projects</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/flags" className="flex items-center gap-2 px-2 py-1.5">
                    <Flag className="h-5 w-5" />
                    {!isCollapsed && <span>Flags</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider text-muted-foreground">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings" className="flex items-center gap-2 px-2 py-1.5">
                    <Settings className="h-5 w-5" />
                    {!isCollapsed && <span>Settings</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/team" className="flex items-center gap-2 px-2 py-1.5">
                    <Users className="h-5 w-5" />
                    {!isCollapsed && <span>Team</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}