"use client";

import { motion } from "framer-motion";

export function AuthCheckbox({ isLogin, item }) {
  return (
    <motion.div
      variants={item}
      className="flex gap-2 items-center rounded-[12px] px-2 py-2 transition-all duration-300 hover:bg-[#D688B7]/10"
    >
      <motion.input
        whileTap={{ scale: 0.85 }}
        type="checkbox"
        className="w-5 h-5 cursor-pointer accent-[#D688B7]"
      />

      <span className="text-xs underline text-gray-600">
        {isLogin ? "Запам'ятати на 30 днів" : "Я погоджуюся з умовами"}
      </span>
    </motion.div>
  );
}