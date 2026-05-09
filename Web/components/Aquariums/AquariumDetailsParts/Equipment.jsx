"use client";

import { motion } from "framer-motion";

export function Equipment({ icon, name, desc, date }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="flex items-center justify-between rounded-2xl bg-gray-50 p-5 transition hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-400">{desc}</p>
        </div>
      </div>

      <div className="text-right text-xs text-gray-400">
        <p>Встановлено</p>
        <p className="font-semibold text-gray-600">{date}</p>
      </div>
    </motion.div>
  );
}