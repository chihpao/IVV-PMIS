'use client';

import { useEffect, useMemo, useState } from 'react';

function isLineInAppBrowser() {
  const ua = navigator.userAgent || '';
  return /Line\//i.test(ua) || /LINE/i.test(ua);
}

export default function ExternalBrowserGate() {
  const [show, setShow] = useState(false);
  const url = useMemo(() => (typeof window !== 'undefined' ? window.location.href : ''), []);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    if (isLineInAppBrowser()) setShow(true);
  }, []);

  const openExternal = async () => {
    const w = window as any;

    // If LIFF SDK is present, prefer the official path
    if (w.liff?.isInClient?.() && w.liff?.openWindow) {
      w.liff.openWindow({ url, external: true });
      return;
    }

    // Fallback: open a new tab (may still stay in in-app on iOS)
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold">LINE 內建瀏覽器限制</h2>
        <p className="mt-2 text-sm text-gray-600">
          Google/第三方登入在 LINE 內建瀏覽器可能會被擋（403 disallowed_useragent）。 請改用外部瀏覽器開啟。
        </p>

        <button className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-white" onClick={openExternal}>
          在外部瀏覽器開啟
        </button>

        <button className="mt-2 w-full rounded-xl border px-4 py-3" onClick={() => setShow(false)}>
          先留在這裡
        </button>

        <p className="mt-3 text-xs text-gray-500">若仍無法跳出：請點右上角「…」→「在瀏覽器開啟」。</p>
      </div>
    </div>
  );
}
