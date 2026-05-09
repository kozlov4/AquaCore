"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AuthLogo() {
  return (
    <motion.div
      id="logo"
      className="w-full h-[10%] mt-3 pl-3"
      whileHover={{ scale: 1.05, rotate: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <Image
        src="/images/Logo.svg"
        alt="fish"
        width={0}
        height={0}
        className="w-20 h-auto drop-shadow-md cursor-pointer transition-all duration-300"
      />
    </motion.div>
  );
}