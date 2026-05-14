"use client";

import { motion } from "framer-motion";
import { Gooogle } from "../../../layouts/icons/google";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://aquacore.onrender.com";

export function GoogleAuthButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/google/login/`;
  };

  return (
    <motion.button
      type="button"
      onClick={handleGoogleLogin}
      whileHover={{
        scale: 1.025,
        y: -2,
      }}
      whileTap={{ scale: 0.96 }}
      className="
        flex w-full max-w-[260px] cursor-pointer
        items-center justify-center gap-2
        rounded-[14px] border border-gray-200
        bg-white/90 p-3.5
        font-medium text-black
        transition-all duration-300
        hover:border-[#D688B7]/70 hover:bg-[#FFF7FB] hover:shadow-md
        sm:max-w-[280px]
        lg:w-[220px] lg:p-3
      "
    >
      <Gooogle />
      Google
    </motion.button>
  );
}