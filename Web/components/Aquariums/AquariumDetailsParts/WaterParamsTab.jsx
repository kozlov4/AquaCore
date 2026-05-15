"use client";

import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const rows = [
  ["Сьогодні, 10:30", "7.2", "8", "0.0"],
  ["15 Квітня 2026", "7.4", "8", "0.0"],
];

export function WaterParamsTab() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[760px] rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur"
    >
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Історія показників води
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Регулярні тести допомагають підтримувати баланс
          </p>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,76,246,0.22)]"
        >
          + Додати тест
        </motion.button>
      </div>

      <table className="w-full overflow-hidden rounded-2xl text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-900">
          <tr>
            <th className="px-5 py-4">Дата</th>
            <th className="px-5 py-4">PH</th>
            <th className="px-5 py-4">GH</th>
            <th className="px-5 py-4">Аміак</th>
            <th className="px-5 py-4">Дія</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row[0]}
              className="border-b border-gray-100 transition hover:bg-[#5B4CF6]/5"
            >
              <td className="px-5 py-5 text-gray-700">{row[0]}</td>
              <td className="px-5 py-5">
                <span className="rounded-md bg-green-100 px-2 py-1 text-green-700">
                  {row[1]}
                </span>
              </td>
              <td className="px-5 py-5 text-gray-700">{row[2]}</td>
              <td className="px-5 py-5 text-gray-700">{row[3]}</td>
              <td className="px-5 py-5 text-gray-400">
                <MoreHorizontal size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}