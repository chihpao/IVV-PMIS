'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Toaster } from '@/lib/sonner';

export const SonnerToaster = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<Toaster richColors closeButton position="bottom-right" theme="light" />, document.body);
};
