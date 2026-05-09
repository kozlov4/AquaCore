"use client";

import { motion } from "framer-motion";

export function EquipmentModalActions({ onClose, onSave }) {
  return (
    <div className="flex items-center justify-end gap-4 bg-gray-50 px-7 py-5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
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
        className="rounded-xl bg-[#5B4CF6] px-6 py-3 font-semibold text-white transition hover:bg-[#4d3feb]"
      >
        Додати пристрій
      </motion.button>
    </div>
  );
}