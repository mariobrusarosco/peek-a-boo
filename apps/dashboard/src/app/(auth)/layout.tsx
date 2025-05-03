import Header from '@/domains/auth/components/auth-header';
import { SidebarProvider } from '@/domains/ui-system/components/ui/sidebar';
import AuthSideBarContainer from '@/domains/auth/components/auth-sidebar-container';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <AuthSideBarContainer />

        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}