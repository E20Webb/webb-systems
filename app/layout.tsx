import '../styles/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from "next/link";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className={`overflow-y-scroll bg-gray-950 font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* GLOBAL HEADER */}
        <header className="mb-4 border-b border-gray-800 pb-0">
          <nav className="relative block text-sm text-gray-300">

            {/* Scroll Container */}
            <div
              className="
                flex overflow-x-auto overflow-y-hidden no-scrollbar
                gap-3 md:gap-8
                whitespace-nowrap
                px-1
              "
            >
              {/* Logo */}
              <Link href="/" className="flex items-center flex-shrink-0">
                <div className="h-6 md:h-12 w-auto flex-shrink-0">
                  <img
                    src="/webb-systems-logo.png"
                    alt="Webb Systems"
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>

              <Link href="/essays" className="hover:text-white flex-shrink-0">Essays</Link>
              <Link href="/architecture" className="hover:text-white flex-shrink-0">Architecture</Link>
              <Link href="/projects/vault" className="hover:text-white flex-shrink-0">Projects</Link>
              <Link href="/about" className="hover:text-white flex-shrink-0">About</Link>
            </div>

            {/* Left Fade */}
            <div
              className="
                pointer-events-none absolute left-0 top-0 bottom-0 w-6
                bg-gradient-to-r from-gray-950 to-transparent
                md:hidden
              "
            />

            {/* Right Fade */}
            <div
              className="
                pointer-events-none absolute right-0 top-0 bottom-0 w-6
                bg-gradient-to-l from-gray-950 to-transparent
                md:hidden
              "
            />

          </nav>
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto mt-2 mb-24 max-w-4xl lg:px-8 lg:py-8">
          {children}
        </div>

      </body>
    </html>
  );
}
