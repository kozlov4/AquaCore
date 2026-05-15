"use client";

import { motion } from "framer-motion";

export function AuthSubmitButton({ isLogin, isLoading = false }) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileHover={
        isLoading
          ? {}
          : {
              scale: 1.025,
              boxShadow: "0px 14px 35px rgba(214, 136, 183, 0.45)",
            }
      }
      whileTap={isLoading ? {} : { scale: 0.96 }}
      className={`
        mt-5 w-full rounded-[14px]
        py-3.5 text-base font-bold text-white
        shadow-lg shadow-[#D688B7]/25
        transition-all duration-300
        sm:py-4
        lg:mt-[5%] lg:py-3
        ${
          isLoading
            ? "cursor-not-allowed bg-[#D688B7]/60"
            : "cursor-pointer bg-[#D688B7] hover:bg-[#c879aa]"
        }
      `}
    >
      {isLoading ? "Зачекайте..." : isLogin ? "Увійти" : "Реєстрація"}
    </motion.button>
  );
}