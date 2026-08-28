import '#/styles/globals.css';

import db from '#/lib/db';
import Byline from '#/ui/byline';
import { GlobalNav } from '#/ui/global-nav';
import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from "next/link";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Next.js Playground', template: '%s | Next.js Playground' },
  metadataBase: new URL('https://app-router.vercel.app'),
  description:
    'A playground to explore Next.js features such as nested layouts, instant loading states, streaming, and component level data fetching.',
  openGraph: {
    title: 'Next.js Playground',
    description:
      'A playground to explore Next.js features such as nested layouts, instant loading states, streaming, and component level data fetching.',
    images: [`/api/og?title=Next.js Playground`],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demos = db.demo.findMany();

  return (
    <html lang="en" className="[color-scheme:dark]">
      <body
        className={`overflow-y-scroll bg-gray-950 font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* LEFT FIXED NAV */}
        <div className="fixed top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-72 lg:border-r lg:border-b-0 lg:border-gray-800">
          <GlobalNav items={demos} />
        </div>

        {/* RIGHT CONTENT COLUMN */}
        <div className="lg:pl-72 min-h-screen flex flex-col">

          {/* GLOBAL HEADER */}
          <header className="mb-6 md:mb-8 border-b border-neutral-800 pb-0">
            <nav className="px-6 py-4 md:py-6 flex items-center gap-4 md:gap-8 text-neutral-300">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/webb-systems-logo.png"
                  alt="Webb Systems"
                  className="h-8 md:h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </Link>

              {/* Links */}
              <div className="flex gap-4 md:gap-6">
                <Link href="/essays" className="text-base md:text-lg hover:text-white transition">
                  Essays
                </Link>
                <Link href="/architecture" className="text-base md:text-lg hover:text-white transition">
                  Architecture
                </Link>
                <Link href="/projects/vault" className="text-base md:text-lg hover:text-white transition">
                  Vault
                </Link>
                <Link href="/about" className="text-base md:text-lg hover:text-white transition">
                  About
                </Link>
              </div>
            </nav>
          </header>

          {/* PAGE CONTENT */}
          <div className="mx-auto mt-2 max-w-4xl -space-y-[1px] lg:px-8 lg:py-8 flex-1">
            {children}
          </div>

          {/* FOOTER */}
          <footer className="border-t border-neutral-800 pt-6 md:pt-8 pb-12 text-neutral-500 text-sm">
            <div className="px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Logo removed */}
                <span className="tracking-wide uppercase text-xs md:text-sm">
                  Webb Systems
                </span>
              </div>
              <div className="text-xs md:text-sm text-neutral-600">
                <Byline />
              </div>
            </div>
          </footer>

        </div>
      </body>
    </html>
  );
}
