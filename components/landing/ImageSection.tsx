"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Separator from "@/components/landing/ui/Separator";

export default function ImageSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="w-full flex flex-col items-center relative z-10 pb-12 md:pb-20"
    >
      {/* LINE 1 */}
      <div className="w-full h-px bg-neutral-700/30"></div>

      {/* Image Box */}
      <div className="w-full max-w-300 px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-16 flex justify-center bg-[#0a0a0a]">
        <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_0_50px_rgba(255,255,255,0.03)] bg-[#050505]">
          <Image
            src="/dash-2.png"
            alt="Formix Dashboard Interface"
            width={1200}
            height={800}
            priority
            className="w-full h-auto object-cover object-top"
          />
        </div>
      </div>

      {/* LINE 2 */}
      <div className="w-full h-px bg-neutral-700/30"></div>

      <div className="w-full max-w-300">
        <Separator />
      </div>

      {/* LINE 3 */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </motion.section>
  );
}
