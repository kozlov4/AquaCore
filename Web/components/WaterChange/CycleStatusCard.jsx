"use client";

import { motion } from "framer-motion";

export function CycleStatusCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08, duration: 0.4 }}
      className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
    >
      <div className="grid grid-cols-[1fr_230px] items-center gap-8">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#2563EB]">
            Статус циклу
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Підміна через 2 дні
          </h2>

          <div className="mt-5">
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "76%" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#635BFF]"
              />
            </div>

            <div className="mt-4 flex justify-between text-xs font-bold text-slate-400">
              <span>Остання: 19 Квітня</span>
              <span>План: 26 Квітня</span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-right text-xs font-black text-slate-700">
            День 5 <span className="text-slate-400">з 7 днів</span>
          </div>

          <motion.button
            whileHover={{
              y: -2,
              boxShadow: "0 16px 34px rgba(99,91,255,0.32)",
            }}
            whileTap={{ scale: 0.96 }}
            className="mb-3 w-full rounded-xl bg-[#635BFF] px-5 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
          >
            ✓ Зафіксувати підміну
          </motion.button>

          <button className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-[#635BFF]/40 hover:text-[#635BFF]">
            Відкласти на день
          </button>
        </div>
      </div>
    </motion.section>
  );
}