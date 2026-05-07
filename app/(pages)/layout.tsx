/* eslint-disable prettier/prettier */
'use client';
import { Footer } from '@/components/footer';
import { SiteHeader } from '@/components/site-header';
import { usePathname } from 'next/navigation';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div suppressHydrationWarning className="flex flex-col min-h-screen w-full">
      {!isHome && <SiteHeader />}
      <main className="flex-1 w-full">
        {children}
      </main>
      {!isHome && <Footer />}
    </div>
  );
}
