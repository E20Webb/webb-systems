"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="relative block text-sm text-gray-300">

      {/* Scroll Container */}
      <div
        className="
          flex overflow-x-auto overflow-y-hidden no-scrollbar
          gap-3 md:gap-8
          whitespace-nowrap
          px-1
          scroll-snap-type-x mandatory
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className={`
            flex items-center flex-shrink-0 scroll-snap-align-start
            ${pathname === "/" ? "text-green-400" : ""}
          `}
        >
          <div className="h-6 md:h-12 w-auto flex-shrink-0">
            <img
              src="/webb-systems-logo.png"
              alt="Webb Systems"
              className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </Link>

        <Link
          href="/essays"
          className={`
            hover:text-white flex-shrink-0 scroll-snap-align-start
            ${pathname === "/essays" ? "text-green-400" : ""}
          `}
        >
          Essays
        </Link>

        <Link
          href="/architecture"
          className={`
            hover:text-white flex-shrink-0 scroll-snap-align-start
            ${pathname === "/architecture" ? "text-green-400" : ""}
          `}
        >
          Architecture
        </Link>

        <Link
          href="/projects/vault"
          className={`
            hover:text-white flex-shrink-0 scroll-snap-align-start
            ${pathname === "/projects/vault" ? "text-green-400" : ""}
          `}
        >
          Projects
        </Link>

        <Link
          href="/about"
          className={`
            hover:text-white flex-shrink-0 scroll-snap-align-start
            ${pathname === "/about" ? "text-green-400" : ""}
          `}
        >
          About
        </Link>
      </div>

      {/* Left Fade */}
      <div
        className="
          pointer-events-none absolute left-0 top-0 bottom-0 w-6
          bg-gradient-to-r from-gray-800 to-transparent
          md:hidden
        "
      />

      {/* Right Fade */}
      <div
        className="
          pointer-events-none absolute right-0 top-0 bottom-0 w-6
          bg-gradient-to-l from-gray-800 to-transparent
          md:hidden
        "
      />
    </nav>
  );
}
