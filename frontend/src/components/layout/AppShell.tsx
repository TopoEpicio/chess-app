import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  workspaceName?: string;
  navGroups: Array<{
    label: string;
    items: Array<{
      label: string;
      to: string;
      icon: ReactNode;
      badge?: string | number;
      badgeVariant?: 'primary' | 'warning' | 'danger';
    }>;
  }>;
  sidebarFooter?: ReactNode;
  children?: ReactNode;
}

export function AppShell({ workspaceName, navGroups, sidebarFooter, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar workspaceName={workspaceName} navGroups={navGroups} footer={sidebarFooter} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto" role="main">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}