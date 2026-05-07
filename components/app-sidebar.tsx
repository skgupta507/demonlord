/* eslint-disable prettier/prettier */
'use client';
import NavUserClient from '@/components/nav-user-client';
import * as React from 'react';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarRail, SidebarMenuItem,
  useSidebar, SidebarGroup, SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  Home, Search, Film, Tv2, Antenna, Book, Tv,
  Heart, Clock, Settings, Skull, Github, Twitter, Instagram, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const NAV_MAIN = [
  { label: 'Home',     href: '/home',    icon: Home                 },
  { label: 'Search',   href: '/search',  icon: Search               },
  { label: 'Movies',   href: '/movie',   icon: Film                 },
  { label: 'TV Shows', href: '/tv',      icon: Tv2                  },
  { label: 'Anime',    href: '/anime',   icon: Antenna              },
  { label: 'K-Drama',  href: '/drama',   icon: Tv                   },
  { label: 'Manga',    href: '/manga',   icon: Book                 },
];

const NAV_SYSTEM = [
  { label: 'Watchlist', href: '/watchlist', icon: Heart    },
  { label: 'History',   href: '/history',  icon: Clock    },
  { label: 'Settings',  href: '/settings', icon: Settings },
];

const SOCIALS = [
  { label: 'GitHub',    href: 'https://github.com/skgupta507',           icon: Github,        color: '#6e40c9' },
  { label: 'X',         href: 'https://x.com/sk_gupta143',               icon: Twitter,       color: '#1DA1F2' },
  { label: 'Instagram', href: 'https://instagram.com/sk.gupta507',        icon: Instagram,     color: '#E1306C' },
  { label: 'Discord',   href: 'https://discord.com/channels/@skgupta507', icon: MessageCircle, color: '#5865F2' },
];

const PARTNERS = [
  { label: 'Arise Music', href: 'https://arise.pp.ua' },
  { label: 'AnimeDex',    href: 'https://animedex.pp.ua' },
  { label: 'Dramzy',      href: 'https://dramzy.qd.je' },
];

function isActive(pathname: string, href: string, exact = false) {
  if (exact) return pathname === href;
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const collapsed = state === 'collapsed';
  const isDark = resolvedTheme !== 'light';

  const mono = { fontFamily: 'Share Tech Mono, monospace' } as const;

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      style={{
        '--sidebar-width': collapsed ? '3.5rem' : '14rem',
      } as React.CSSProperties}
    >
      {/* ── HEADER: Logo ── */}
      <SidebarHeader className="pb-3 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent active:bg-transparent"
            >
              <Link href="/home" className="flex items-center gap-3">
                {/* Logo diamond */}
                <div className="relative h-8 w-8 shrink-0 flex items-center justify-center rounded-lg"
                  style={{ background: 'var(--neon-pink)' }}>
                  <Skull size={15} className="text-white" />
                </div>
                {!collapsed && (
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-black tracking-[0.12em] text-[var(--neon-pink)]"
                      style={{ fontFamily: 'Orbitron, monospace' }}>
                      DEMONLORD
                    </span>
                    <span className="text-[0.5rem] tracking-[0.2em] opacity-40 mt-0.5" style={mono}>
                      NEURAL CINEMA
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden px-1 gap-0">

        {/* ── LIVE indicator ── */}
        {!collapsed && (
          <div className="mx-2 mb-3 flex items-center gap-2 rounded-md px-2 py-1.5"
            style={{ background: 'color-mix(in srgb, var(--neon-green) 8%, transparent)' }}>
            <div className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--neon-green)' }} />
            <span className="text-[0.5rem] tracking-widest" style={{ ...mono, color: 'var(--neon-green)' }}>
              SYSTEM ONLINE
            </span>
          </div>
        )}

        {/* ── MAIN NAV ── */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <p className="px-3 pb-1 pt-1 text-[0.48rem] tracking-[0.25em] opacity-40 uppercase" style={mono}>
              NAVIGATION
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_MAIN.map(item => {
                const active = isActive(pathname, item.href, item.exact);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={active}
                      className="rounded-lg transition-all duration-150 h-10"
                      style={active ? {
                        background: isDark ? 'rgba(255,0,111,0.12)' : 'rgba(204,0,85,0.08)',
                        color: 'var(--neon-pink)',
                      } : {}}
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-2">
                        <item.icon
                          size={17}
                          style={{
                            color: active ? 'var(--neon-pink)' : undefined,
                            strokeWidth: active ? 2.2 : 1.6,
                          }}
                        />
                        {!collapsed && (
                          <span
                            className="text-[0.75rem] font-medium tracking-wide"
                            style={{
                              fontFamily: 'Rajdhani, sans-serif',
                              fontWeight: active ? 700 : 500,
                              color: active ? 'var(--neon-pink)' : undefined,
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── SYSTEM ── */}
        <SidebarGroup className="p-0 mt-2">
          {!collapsed && (
            <p className="px-3 pb-1 pt-1 text-[0.48rem] tracking-[0.25em] opacity-40 uppercase" style={mono}>
              SYSTEM
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_SYSTEM.map(item => {
                const active = isActive(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={active}
                      className="rounded-lg h-9"
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-2">
                        <item.icon size={15} className="opacity-60" strokeWidth={1.6} />
                        {!collapsed && (
                          <span className="text-[0.72rem] opacity-60" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── SOCIAL LINKS ── */}
        {!collapsed && (
          <SidebarGroup className="p-0 mt-2">
            <p className="px-3 pb-1 pt-1 text-[0.48rem] tracking-[0.25em] opacity-40 uppercase" style={mono}>
              SOCIALS
            </p>
            <SidebarGroupContent>
              <div className="px-2 grid grid-cols-4 gap-1">
                {SOCIALS.map(s => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center h-8 w-8 rounded-lg transition-all hover:scale-110"
                    title={s.label}
                    style={{ color: s.color }}
                  >
                    <s.icon size={15} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* ── PARTNERS ── */}
        {!collapsed && (
          <SidebarGroup className="p-0 mt-2">
            <p className="px-3 pb-1 text-[0.48rem] tracking-[0.25em] opacity-40 uppercase" style={mono}>
              NETWORK
            </p>
            <SidebarGroupContent>
              <div className="px-2 space-y-0.5">
                {PARTNERS.map(p => (
                  <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-1 py-1 rounded-md opacity-50 hover:opacity-80 transition-opacity text-[0.65rem]"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    <span className="h-1 w-1 rounded-full shrink-0" style={{ background: 'var(--neon-pink)' }} />
                    {p.label}
                  </a>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>

      {/* ── FOOTER: User ── */}
      <SidebarFooter className="border-t border-[hsl(var(--border))] pt-3 pb-4 px-2">
        <NavUserClient />
        {!collapsed && (
          <p className="px-1 pt-2 text-[0.45rem] tracking-widest opacity-25 uppercase" style={mono}>
            demonlord.pp.ua
          </p>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
