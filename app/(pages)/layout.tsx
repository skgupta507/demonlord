/* eslint-disable prettier/prettier */
import { Footer } from '@/components/footer';

// All pages inside (pages) get the footer appended.
// The sidebar + floating nav come from LayoutShell in app/layout.tsx.
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
