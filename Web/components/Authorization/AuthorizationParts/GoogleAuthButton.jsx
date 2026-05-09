"use client";

import { motion } from "framer-motion";
import { Gooogle } from "../../../layouts/icons/google";

export function GoogleAuthButton() {
  return (
    <motion.button
      type="button"
      whileHover={{
        scale: 1.04,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
      className="w-[220px] flex justify-center items-center gap-2 p-3 border border-gray-200 rounded-[14px] cursor-pointer bg-white/80 text-black font-medium transition-all duration-300 hover:border-[#D688B7]/70 hover:bg-[#FFF7FB] hover:shadow-md"
    >
      <Gooogle />
      Google
    </motion.button>
  );
}