import { AppHeader } from '@/components/header';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { ProjectProvider } from '@/context/project-context';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { ProjectList } from '@/components/project-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <SidebarMenuButton>
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <ScrollArea className="h-full">
                    <ProjectList />
                </ScrollArea>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProjectProvider>
  );
}
