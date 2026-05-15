"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      whileHover={{ y: -3 }}
      className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-6 py-5 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
          <AlertTriangle size={22} />
        </div>

        <div>
          <p className="text-sm font-black text-red-700">
            Потребує уваги: Обладнання
          </p>

          <p className="mt-1 text-sm text-red-600">
            Лампа Chihiros WRGB II в "Головний Травник" потребує планової
            очистки від нальоту.
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="rounded-xl bg-red-500 px-6 py-3 text-sm font-black text-white transition hover:bg-red-600"
      >
        Вирішити
      </motion.button>
    </motion.div>
  );
}