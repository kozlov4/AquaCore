"use client";

import { motion } from "framer-motion";
import { Resident } from "./Resident";

export function PopulationTab({ residents, onAddResident }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[760px] rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur"
    >
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Населення акваріума
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Загальна кількість: {residents.length} види
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onAddResident}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,76,246,0.22)]"
        >
          + Додати жителів
        </motion.button>
      </div>

      <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <p className="font-bold text-green-700">✅ Сумісність відмінна</p>
        <p className="mt-1 text-sm text-green-600">
          Всі види мирні та підходять для поточних параметрів води.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {residents.map((resident, index) => (
          <Resident key={`${resident.name}-${index}`} {...resident} />
        ))}
      </div>
    </motion.section>
  );
}