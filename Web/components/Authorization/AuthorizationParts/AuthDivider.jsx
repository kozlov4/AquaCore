"use client";

import { motion } from "framer-motion";

export function AuthDivider({ item }) {
  return (
    <motion.div
      variants={item}
      className="my-7 flex items-center sm:my-8 lg:my-[10%]"
    >
      <div className="h-[1px] flex-1 bg-gray-200" />
      <span className="px-3 text-xs text-gray-400">Або</span>
      <div className="h-[1px] flex-1 bg-gray-200" />
    </motion.div>
  );
}