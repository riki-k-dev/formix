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
      className="w-full flex flex-col items-center relative z-10 pb-20"
    >
      {/* LINE 1 */}
      <div className="w-full h-px bg-neutral-700/30"></div>

      {/* Image Box */}
      <div className="w-full max-w-300">
        {/* <div className="h-[90vh] w-full bg-[#d9d9d9]"></div> */}
        <Image
          src="/dash-2.png"
          alt="Dashboard"
          width={1200}
          height={800}
          className="w-full h-[90vh] object-cover"
        />
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
