"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddSpeciesToAquariumModal({ isOpen, onClose }) {
  const [count, setCount] = useState("10");
  const [date, setDate] = useState("2026-04-23");
  const [aquarium, setAquarium] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-2xl font-black text-slate-950">
                Заселення жителів
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <p className="mb-2 text-base font-bold text-slate-700">
                  Обраний вид
                </p>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    🐟
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      Неон звичайний
                    </h3>
                    <p className="text-sm text-slate-500">
                      Paracheirodon innesi
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-base font-bold text-slate-700">
                  Куди поселити?
                </p>

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-base font-medium text-slate-900 transition hover:border-[#635BFF] focus:border-[#635BFF]"
                >
                  <span>{aquarium || "Оберіть екосистему..."}</span>
                  <ChevronDown size={20} />
                </button>

                <p className="mt-2 text-sm text-slate-400">
                  Система автоматично перевірить сумісність після вибору.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-base font-bold text-slate-700">
                    Кількість &#40;шт.&#41;
                  </label>

                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-bold text-slate-700">
                    Дата заселення
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-5 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="text-base font-bold text-slate-600 transition hover:text-slate-950"
              >
                Скасувати
              </button>

              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{
                  y: -2,
                  boxShadow: "0 14px 28px rgba(99,91,255,0.32)",
                }}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl bg-[#635BFF] px-6 py-3 text-base font-black text-white transition hover:bg-[#5147f5]"
              >
                Заселити в акваріум
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}