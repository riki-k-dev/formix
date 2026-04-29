"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Feature", href: "/#solution" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 flex justify-center bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-700/30">
      <div className="w-full max-w-300 flex items-center justify-between px-6 relative z-50 bg-transparent">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 relative z-50"
          onClick={() => setIsOpen(false)}
        >
          <Image
            className="border-zinc-800 border rounded-lg p-1 flex items-center justify-center shrink-0 w-9 h-9 bg-[#0a0a0a]"
            src="/i2-t4.png"
            alt="logo"
            width={26}
            height={26}
          />
          <span className="text-neutral-200 font-bold text-lg tracking-tight">
            Formix
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex gap-8 ml-11 text-sm text-neutral-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP CTA BUTTON */}
        <Link
          href="/login"
          className="hidden md:flex bg-white text-black px-4 py-2 text-sm font-medium items-center gap-2 rounded-md hover:bg-neutral-200 transition-colors"
        >
          Get Started Now ⟶
        </Link>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 w-6 h-6 flex flex-col justify-center items-center md:hidden focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
            className="absolute block h-0.5 w-6 bg-neutral-300 rounded-full transition-transform"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="absolute block h-0.5 w-6 bg-neutral-300 rounded-full transition-opacity"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
            className="absolute block h-0.5 w-6 bg-neutral-300 rounded-full transition-transform"
          />
        </button>
      </div>

      {/* MOBILE FULL-SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-screen bg-[#0a0a0a] pt-28 px-6 pb-6 md:hidden flex flex-col overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 text-lg text-neutral-300 mb-8">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left font-medium hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full h-px bg-neutral-800 my-4"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-4"
            >
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full bg-white text-black px-4 py-3.5 text-base font-medium flex items-center justify-center gap-2 rounded-md hover:bg-neutral-200 transition-colors"
              >
                Get Started Now ⟶
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
