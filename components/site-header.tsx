/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Film, Tv2, Antenna, Book, Tv, Search, Sun, Moon, Skull } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSidebar } from '@/components/ui/sidebar';

const NAV_ITEMS = [
  { name: 'Home',     href: '/home',   icon: Home    },
  { name: 'Movies',   href: '/movie',  icon: Film    },
  { name: 'TV',       href: '/tv',     icon: Tv2     },
  { name: 'Anime',    href: '/anime',  icon: Antenna },
  { name: 'K-Drama',  href: '/drama',  icon: Tv      },
  { name: 'Manga',    href: '/manga',  icon: Book    },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const [mounted,        setMounted]        = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [hovered,        setHovered]        = useState<string | null>(null);
  const [scrolled,       setScrolled]       = useState(false);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const active = NAV_ITEMS.find(i => pathname.startsWith(i.href))?.name ?? 'Home';
  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

  return (
    /* Fixed top bar — full width, pointer-events none so content scrolls under */
    <div className="fixed left-0 right-0 top-4 z-[99999] flex justify-center pointer-events-none px-4">
      <motion.div
        className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl"
        style={{
          background: scrolled
            ? (isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)')
            : (isDark ? 'rgba(0,0,0,0.6)'  : 'rgba(255,255,255,0.75)'),
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Sidebar toggle (desktop) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
          aria-label="Toggle sidebar"
        >
          <Menu size={15} />
        </button>

        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 mr-1 select-none shrink-0">
          <div className="h-6 w-6 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--neon-pink)' }}>
            <Skull size={12} className="text-white" />
          </div>
          <span className="hidden sm:block text-xs font-black tracking-widest"
            style={{ ...mono, color: 'var(--neon-pink)' }}>
            DEMONLORD
          </span>
        </Link>

        {/* Desktop nav items */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive  = active === item.name;
            const isHovered = hovered === item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
                className="relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150"
                style={{
                  ...mono,
                  color: isActive
                    ? (isDark ? '#fff' : '#000')
                    : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
                }}
              >
                {/* Active pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover highlight */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-4 mx-1"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

        {/* Search */}
        <Link href="/search"
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
          aria-label="Search">
          <Search size={14} />
        </Link>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="h-7 w-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden h-7 w-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-auto absolute top-[52px] left-1/2 -translate-x-1/2 w-[92vw] max-w-sm rounded-2xl shadow-2xl p-2 flex flex-col gap-0.5"
            style={{
              background: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.97)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon     = item.icon;
              const isActive = active === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    ...mono,
                    background: isActive
                      ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')
                      : 'transparent',
                    color: isActive
                      ? (isDark ? '#fff' : '#000')
                      : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
                  }}
                >
                  <Icon size={15} />
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t mt-1 pt-2 px-2 flex items-center justify-between"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
              <Link href="/search" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-xs py-1"
                style={{ ...mono, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                <Search size={13} /> Search
              </Link>
              {mounted && (
                <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="flex items-center gap-2 text-xs py-1"
                  style={{ ...mono, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                  {isDark ? <Sun size={13} /> : <Moon size={13} />}
                  {isDark ? 'Light' : 'Dark'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
