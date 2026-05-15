"use client";

import { motion } from "framer-motion";

export function AuthCheckbox({ isLogin, item }) {
  return (
    <motion.label
      variants={item}
      className="
        mt-1 flex cursor-pointer items-center gap-2
        rounded-[12px] px-2 py-2
        transition-all duration-300 hover:bg-[#D688B7]/10
      "
    >
      <motion.input
        whileTap={{ scale: 0.85 }}
        type="checkbox"
        className="
          h-5 w-5 shrink-0 cursor-pointer accent-[#D688B7]
        "
      />

      <span className="text-xs leading-5 text-gray-600 underline sm:text-sm">
        {isLogin ? "Запам'ятати на 30 днів" : "Я погоджуюся з умовами"}
      </span>
    </motion.label>
  );
}