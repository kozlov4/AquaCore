"use client";

import { motion } from "framer-motion";
import { Gooogle } from "../../../layouts/icons/google";
import { startGoogleLogin } from "../../../services/authApi";

export function GoogleAuthButton() {
  const handleGoogleLogin = () => {
    startGoogleLogin();
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleLogin}
      className="flex h-[50px] w-full items-center justify-center gap-3 rounded-[14px] border border-[#E5E7EB] bg-white text-[15px] font-semibold text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
    >
      <Gooogle />
      <span>Google</span>
    </motion.button>
  );
}