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
  Heart, Clock, Settings, Skull, Github, MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const NAV_MAIN = [
  { label: 'Home',     href: '/home',   icon: Home    },
  { label: 'Search',   href: '/search', icon: Search  },
  { label: 'Movies',   href: '/movie',  icon: Film    },
  { label: 'TV Shows', href: '/tv',     icon: Tv2     },
  { label: 'Anime',    href: '/anime',  icon: Antenna },
  { label: 'K-Drama',  href: '/drama',  icon: Tv      },
  { label: 'Manga',    href: '/manga',  icon: Book    },
];

const NAV_LIBRARY = [
  { label: 'Watchlist', href: '/watchlist', icon: Heart    },
  { label: 'History',   href: '/history',   icon: Clock    },
  { label: 'Settings',  href: '/settings',  icon: Settings },
];

const SOCIALS = [
  { label: 'GitHub',  href: 'https://github.com/skgupta507',           icon: Github        },
  { label: 'Discord', href: 'https://discord.com/channels/@skgupta507', icon: MessageCircle },
];

function isActive(pathname: string, href: string) {
  if (href === '/home') return pathname === '/home' || pathname === '/';
  return pathname.startsWith(href);
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const collapsed = state === 'collapsed';
  const isDark = resolvedTheme !== 'light';

  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

  // Cosmic-style colors
  const textMuted  = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const textNormal = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
  const textActive = isDark ? '#fff' : '#000';
  const borderClr  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const activeBg   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const hoverBg    = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      style={{ '--sidebar-width': '13rem' } as React.CSSProperties}
    >
      {/* ── HEADER ── */}
      <SidebarHeader className="px-3 py-3" style={{ borderBottom: `1px solid ${borderClr}` }}>
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--neon-pink)' }}>
              <Skull size={13} className="text-white" />
            </div>
            {!collapsed && (
              <span className="text-sm font-black tracking-widest truncate"
                style={{ ...mono, color: 'var(--neon-pink)' }}>
                DEMONLORD
              </span>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={toggleSidebar}
              className="h-6 w-6 rounded-md flex items-center justify-center transition-colors shrink-0"
              style={{ color: textMuted }}
              aria-label="Collapse sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 gap-0 overflow-x-hidden">

        {/* ── BROWSE ── */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[0.58rem] font-semibold uppercase tracking-widest"
              style={{ ...mono, color: textMuted }}>
              Browse
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_MAIN.map(item => {
                const active = isActive(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={active}
                      className="h-9 rounded-lg transition-colors"
                      style={{ background: active ? activeBg : 'transparent' }}
                    >
                      <Link href={item.href} className="flex items-center gap-2.5 px-2">
                        <item.icon
                          size={15}
                          strokeWidth={active ? 2.2 : 1.6}
                          style={{ color: active ? textActive : textMuted, flexShrink: 0 }}
                        />
                        {!collapsed && (
                          <span className="text-sm truncate"
                            style={{
                              ...mono,
                              fontWeight: active ? 600 : 400,
                              color: active ? textActive : textNormal,
                            }}>
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

        {/* ── LIBRARY ── */}
        <SidebarGroup className="p-0 mt-5">
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[0.58rem] font-semibold uppercase tracking-widest"
              style={{ ...mono, color: textMuted }}>
              Library
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_LIBRARY.map(item => {
                const active = isActive(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={active}
                      className="h-9 rounded-lg transition-colors"
                      style={{ background: active ? activeBg : 'transparent' }}
                    >
                      <Link href={item.href} className="flex items-center gap-2.5 px-2">
                        <item.icon
                          size={15}
                          strokeWidth={active ? 2.2 : 1.6}
                          style={{ color: active ? textActive : textMuted, flexShrink: 0 }}
                        />
                        {!collapsed && (
                          <span className="text-sm truncate"
                            style={{
                              ...mono,
                              fontWeight: active ? 600 : 400,
                              color: active ? textActive : textNormal,
                            }}>
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

        {/* ── COMMUNITY ── */}
        {!collapsed && (
          <SidebarGroup className="p-0 mt-5">
            <p className="px-2 pb-1.5 text-[0.58rem] font-semibold uppercase tracking-widest"
              style={{ ...mono, color: textMuted }}>
              Community
            </p>
            <SidebarGroupContent>
              <div className="flex gap-1.5 px-2">
                {SOCIALS.map(s => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                    title={s.label}
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      border: `1px solid ${borderClr}`,
                      color: textMuted,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon-pink)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--neon-pink)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = borderClr;
                      (e.currentTarget as HTMLElement).style.color = textMuted;
                    }}>
                    <s.icon size={14} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>

      {/* ── FOOTER ── */}
      <SidebarFooter className="px-2 py-3" style={{ borderTop: `1px solid ${borderClr}` }}>
        {collapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full h-8 rounded-lg flex items-center justify-center mb-2 transition-colors"
            style={{ color: textMuted, background: hoverBg }}
            aria-label="Expand sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <NavUserClient />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
