/* eslint-disable prettier/prettier */
'use client';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Landing page (/) — rendered by app/(landing)/page.tsx
  // It has its own bare layout, so we just pass children through with no chrome.
  if (pathname === '/') {
    return <>{children}</>;
  }

  // All other pages get sidebar + floating nav
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '13rem', '--header-height': '3.25rem' } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {/* pt-20 clears the fixed floating nav (top-4 + ~52px) */}
        <div className="pt-20 min-h-screen overflow-x-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
