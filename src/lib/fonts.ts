import { JetBrains_Mono, Noto_Sans_TC, Noto_Serif_TC, Space_Grotesk } from 'next/font/google';

export const fontBody = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// For traditional chinese support, we might need to handle subsets carefully or just use fallback
export const fontSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
  preload: false, // Often needed for large CJK fonts if subsets are tricky
});

export const fontDisplay = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-display',
  preload: false,
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
