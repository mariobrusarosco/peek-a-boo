import { useState } from 'react';
import Link from 'next/link';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LayoutDashboard, Folder, Flag } from 'lucide-react';

export default function AuthSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside
      className={`bg-sidebar transition-all duration-300 ${isSidebarOpen ? 'max-w-[250px] w-fit' : 'w-[80px]'} h-full`}
    >
      <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="m-4">
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LayoutDashboard className="h-5 w-5" />
                <span className={isSidebarOpen ? 'inline ml-2' : 'hidden'}>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Folder className="h-5 w-5" />
                <span className={isSidebarOpen ? 'inline ml-2' : 'hidden'}>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/flags">
                  <Flag className="h-5 w-5" />
                  <span className={isSidebarOpen ? 'inline ml-2' : 'hidden'}>Flags</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </aside>
  );
}