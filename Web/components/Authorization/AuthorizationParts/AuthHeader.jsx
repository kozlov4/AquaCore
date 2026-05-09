"use client";

import { motion } from "framer-motion";

export function AuthHeader({ isLogin, item }) {
  return (
    <>
      <motion.h1
        variants={item}
        className="text-black font-semibold text-3xl tracking-tight"
      >
        {isLogin ? "З поверненням!" : "Почніть зараз"}
      </motion.h1>

      <motion.h3
        variants={item}
        className={`text-gray-500 text-base mt-2 ${
          isLogin ? "block" : "hidden"
        }`}
      >
        Введіть свої облікові дані, щоб увійти
      </motion.h3>
    </>
  );
}