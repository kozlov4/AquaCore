"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DiseaseDetailsModal({ disease, onClose }) {
  return (
    <AnimatePresence>
      {disease && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 45 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[34px] border border-white/70 bg-white/95 shadow-[0_35px_110px_rgba(15,23,42,0.34)] backdrop-blur-2xl"
          >
            <div className="relative flex h-[165px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF4D7] via-[#FFF9EC] to-white text-6xl">
              <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-red-300/25 blur-3xl" />
              <div className="absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#5B4CF6]/15 blur-3xl" />

              <motion.span
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 250 }}
                className="relative z-10 drop-shadow-sm"
              >
                ⚠️
              </motion.span>

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 z-20 rounded-full border border-white/70 bg-white/85 p-2.5 text-slate-500 shadow-lg backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-slate-950 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(88vh-165px)] overflow-y-auto p-7">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                {disease.title}
              </h2>

              <span className="mt-3 inline-flex rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 shadow-sm">
                🚨 Висока небезпека
              </span>

              <div className="mt-4 flex flex-wrap gap-2">
                {disease.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500"
                  >
                    #{symptom}
                  </span>
                ))}
              </div>

              <section className="mt-7 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 shadow-inner">
                <h3 className="border-b border-red-100 pb-3 font-black text-slate-900">
                  🔍 Діагностика — точні симптоми
                </h3>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                  {disease.diagnostics.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span>✅</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-5 rounded-3xl border border-white bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
                <h3 className="font-black text-slate-900">
                  💡 Причини виникнення
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {disease.reason}
                </p>
              </section>

              <section className="mt-5">
                <h3 className="font-black text-slate-900">
                  💊 Протокол лікування
                </h3>

                <ol className="mt-4 space-y-3 text-sm text-slate-700">
                  {disease.treatment.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 shadow-sm"
                    >
                      <span className="mr-2 font-black text-red-500">
                        {index + 1}.
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ol>
              </section>

              <div className="mt-7 flex items-center justify-between gap-4 rounded-3xl border border-[#5B4CF6]/20 bg-gradient-to-br from-[#F7F5FF] to-white p-5 shadow-[0_18px_45px_rgba(91,76,246,0.08)]">
                <div>
                  <p className="font-black text-[#5B4CF6]">
                    Не впевнені у діагнозі?
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Спитайте у спільноті — допоможуть за хвилини
                  </p>
                </div>

                <motion.button
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="cursor-pointer rounded-2xl bg-[#5B4CF6] px-5 py-3 text-sm font-black text-white shadow-[0_16px_35px_rgba(91,76,246,0.3)] transition hover:bg-[#493bdc]"
                >
                  Спитати?
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}