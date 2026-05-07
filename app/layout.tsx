/* eslint-disable prettier/prettier */
import { siteConfig } from '@/config/site';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Providers } from './providers';
import LayoutShell from '@/components/layout-shell';

const geistSans = localFont({
  src: [
    { path: '../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2',    weight: '400',     style: 'normal' },
    { path: '../node_modules/geist/dist/fonts/geist-sans/Geist-Black.woff2',      weight: '900',     style: 'normal' },
    { path: '../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',   weight: '100 900', style: 'normal' },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = localFont({
  src: [
    { path: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2', weight: '400',     style: 'normal' },
    { path: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Black.woff2',   weight: '900',     style: 'normal' },
    { path: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2',weight: '100 900', style: 'normal' },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#f4f7fe' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://demonlord.pp.ua'),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ['streaming', 'movies', 'anime', 'tv shows', 'free', 'demonlord'],
  openGraph: {
    type: 'website', locale: 'en_US', url: 'https://demonlord.pp.ua',
    title: siteConfig.name, description: siteConfig.description, siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* No extra wrapper — body is the root, LayoutShell handles everything */}
      <body className="min-h-screen antialiased bg-background text-foreground" suppressHydrationWarning>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="demonlord-theme"
          >
            <NextTopLoader color="#FF006F" height={2} showSpinner={false} shadow="0 0 8px #FF006F" />
            <Toaster position="top-right" closeButton theme="system" />
            {/* LayoutShell decides whether to show sidebar or not */}
            <LayoutShell>{children}</LayoutShell>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
