"use client";

import { motion } from "framer-motion";

export function AquariumModalActions({ onClose, onSave }) {
  return (
    <div className="flex items-center justify-end gap-4 bg-gray-50 px-7 py-5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
      >
        Скасувати
      </button>

      <motion.button
        type="button"
        onClick={onSave}
        whileHover={{
          y: -2,
          boxShadow: "0 14px 30px rgba(91,76,246,.28)",
        }}
        whileTap={{ scale: 0.97 }}
        className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#9333EA] px-6 py-3 font-semibold text-white transition"
      >
        Створити акваріум
      </motion.button>
    </div>
  );
}