"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AuthLogo() {
  return (
    <motion.div
      id="logo"
      className="
        flex w-full items-center
        pt-1
        lg:h-[10%] lg:pl-3 lg:pt-3
      "
      whileHover={{ scale: 1.04, rotate: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <Image
        src="/images/Logo.svg"
        alt="logo"
        width={96}
        height={40}
        priority
        className="
          h-auto w-20 cursor-pointer drop-shadow-md
          transition-all duration-300
          sm:w-24
          lg:w-20
        "
      />
    </motion.div>
  );
}