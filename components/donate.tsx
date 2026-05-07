/* eslint-disable prettier/prettier */
'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

export default function Donate() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;

    const snoozedUntil = localStorage.getItem('demonlord_snooze');
    if (snoozedUntil && Date.now() < parseInt(snoozedUntil, 10)) return;

    const timer = setTimeout(() => {
      toast('👹 Enjoying DemonLord?', {
        description: 'Completely free, no ads. Star us on GitHub if you like it!',
        action: {
          label: 'GitHub ⭐',
          onClick: () => window.open('https://github.com/demonlord-pp-ua/demonlord', '_blank'),
        },
        cancel: {
          label: 'Later',
          onClick: () => {
            // Snooze for 24h
            localStorage.setItem('demonlord_snooze', String(Date.now() + 86400000));
          },
        },
        duration: 8000,
      });
      setShown(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, shown]);

  useEffect(() => {
    setShown(false);
  }, [pathname]);

  return <></>;
}
