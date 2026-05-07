/* eslint-disable prettier/prettier */
'use client';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) {
    // Landing page: full width, no sidebar
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-x-hidden">
        {children}
      </SidebarInset>
    </>
  );
}
