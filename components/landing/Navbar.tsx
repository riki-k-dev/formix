"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 flex justify-center bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="w-full max-w-300 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="border-zinc-800 border rounded-lg p-1 flex items-center justify-center shrink-0 w-9 h-9"
            src="/i2-t4.png"
            alt="logo"
            width={26}
            height={26}
          />
          <span className="text-neutral-200 font-bold text-lg tracking-tight">
            Formix
          </span>
        </Link>

        <nav className="flex gap-8 ml-11 text-sm text-neutral-300">
          <Link href="#solution" className="hover:text-white transition-colors">
            Feature
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        <Link
          href="/login"
          className="bg-white text-black px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-md hover:bg-neutral-200 transition-colors"
        >
          Get Started Now ⟶
        </Link>
      </div>
    </header>
  );
}
