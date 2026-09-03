import '../styles/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import NavBar from "./NavBar";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className={`overflow-y-scroll bg-gray-950 font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* GLOBAL HEADER */}
        <header className="mb-4 border-b border-gray-800 pb-0">
          <NavBar />
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto mt-2 mb-24 max-w-4xl lg:px-8 lg:py-8">
          {children}
        </div>

      </body>
    </html>
  );
}
