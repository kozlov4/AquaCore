"use client";

import { motion } from "framer-motion";

export function AuthSubmitButton({ isLogin }) {
  return (
    <motion.button
      type="submit"
      whileHover={{
        scale: 1.025,
        boxShadow: "0px 14px 35px rgba(214, 136, 183, 0.45)",
      }}
      whileTap={{ scale: 0.96 }}
      className="
        mt-5 w-full cursor-pointer
        rounded-[14px] bg-[#D688B7]
        py-3.5 text-base font-bold text-white
        shadow-lg shadow-[#D688B7]/25
        transition-all duration-300 hover:bg-[#c879aa]
        sm:py-4
        lg:mt-[5%] lg:py-3
      "
    >
      {isLogin ? "Увійти" : "Реєстрація"}
    </motion.button>
  );
}