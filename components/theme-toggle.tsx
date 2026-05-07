/* eslint-disable prettier/prettier */
'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={`flex items-center justify-center w-8 h-8 border transition-all ${
        isDark
          ? 'border-white/10 text-white/40 hover:border-[#F9F002]/40 hover:text-[#F9F002]'
          : 'border-gray-200 text-gray-500 hover:border-[#FF006F]/40 hover:text-[#FF006F]'
      }`}
    >
      {isDark
        ? <Sun size={13} />
        : <Moon size={13} />
      }
    </button>
  );
}
