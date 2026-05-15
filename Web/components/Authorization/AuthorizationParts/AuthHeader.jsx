"use client";

import { motion } from "framer-motion";

export function AuthHeader({ isLogin, item }) {
  return (
    <>
      <motion.h1
        variants={item}
        className="
          text-3xl font-semibold tracking-tight text-black
          sm:text-4xl
          lg:text-3xl
        "
      >
        {isLogin ? "З поверненням!" : "Почніть зараз"}
      </motion.h1>

      <motion.h3
        variants={item}
        className={`
          mt-2 max-w-[330px] text-sm leading-6 text-gray-500
          sm:text-base
          ${isLogin ? "block" : "hidden"}
        `}
      >
        Введіть свої облікові дані, щоб увійти
      </motion.h3>
    </>
  );
}