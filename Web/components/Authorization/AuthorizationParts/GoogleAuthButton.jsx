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
      onClick={handleGoogleLogin}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <Gooogle />
      Google
    </motion.button>
  );
}