"use client";

import { motion } from "framer-motion";

export function DiseasesCategories() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.4 }}
      className="mt-6 flex justify-center gap-3"
    >
      <span className="rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-black text-blue-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
        🐟 Риби
      </span>

      <span className="rounded-full border border-orange-100 bg-white/80 px-4 py-2 text-sm font-black text-orange-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
        🦐 Безхребетні
      </span>
    </motion.div>
  );
}