"use client";

import { motion } from "framer-motion";

export function AuthDivider({ item }) {
  return (
    <motion.div variants={item} className="flex items-center my-[10%]">
      <div className="flex-1 h-[1px] bg-gray-200" />
      <span className="px-2 text-xs text-gray-400">Або</span>
      <div className="flex-1 h-[1px] bg-gray-200" />
    </motion.div>
  );
}