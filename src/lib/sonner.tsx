'use client';

import * as sonner from 'sonner';

declare global {
  interface Window {
    __sonnerShared?: typeof sonner;
  }
}

const shared = typeof window !== 'undefined' ? (window.__sonnerShared ?? (window.__sonnerShared = sonner)) : sonner;

export const toast = shared.toast;
export const Toaster = shared.Toaster;
