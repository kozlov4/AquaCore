"use client";

import { Square } from "lucide-react";
import { motion } from "framer-motion";

export function Task({ title, badge, urgent }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between rounded-xl p-2 transition hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Square size={18} />
        <span className="text-sm text-gray-700">{title}</span>
      </div>

      <span
        className={urgent ? "text-xs text-red-500" : "text-xs text-gray-400"}
      >
        {badge}
      </span>
    </motion.div>
  );
}