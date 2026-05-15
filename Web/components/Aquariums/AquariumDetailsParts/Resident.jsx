"use client";

import { motion } from "framer-motion";

export function Resident({ name, latin, count, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#5B4CF6]/20 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-400">{latin}</p>
        </div>
      </div>

      <p className="font-bold text-gray-900">{count}</p>
    </motion.div>
  );
}