"use client";

import { motion } from "framer-motion";

export function AuthSubmitButton({ isLogin }) {
  return (
    <motion.button
      type="submit"
      whileHover={{
        scale: 1.04,
        boxShadow: "0px 14px 35px rgba(214, 136, 183, 0.45)",
      }}
      whileTap={{ scale: 0.95 }}
      className="w-full mt-[5%] py-3 rounded-[14px] cursor-pointer bg-[#D688B7] text-white font-bold transition-all duration-300 hover:bg-[#c879aa] shadow-lg shadow-[#D688B7]/25"
    >
      {isLogin ? "Увійти" : "Реєстрація"}
    </motion.button>
  );
}