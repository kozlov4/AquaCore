"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DiseaseDetailsModal({ disease, onClose }) {
  return (
    <AnimatePresence>
      {disease && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[32px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
          >
            <div className="relative flex h-[150px] items-center justify-center bg-gradient-to-br from-[#FFF8EA] to-[#FFF0D0] text-6xl">
              <motion.span
                initial={{ scale: 0.6, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.08, type: "spring" }}
              >
                ⚠️
              </motion.span>

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 rounded-full bg-white p-2 text-gray-500 shadow transition hover:scale-105 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-7">
              <h2 className="text-2xl font-bold text-gray-950">
                {disease.title}
              </h2>

              <span className="mt-3 inline-block rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                🚨 Висока небезпека
              </span>

              <div className="mt-4 flex flex-wrap gap-2">
                {disease.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500"
                  >
                    #{symptom}
                  </span>
                ))}
              </div>

              <section className="mt-7 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
                <h3 className="border-b border-red-100 pb-3 font-bold text-gray-900">
                  🔍 Діагностика — точні симптоми
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {disease.diagnostics.map((item) => (
                    <li key={item}>✅ {item}</li>
                  ))}
                </ul>
              </section>

              <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-gray-900">
                  💡 Причини виникнення
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {disease.reason}
                </p>
              </section>

              <section className="mt-5">
                <h3 className="font-bold text-gray-900">
                  💊 Протокол лікування
                </h3>

                <ol className="mt-4 space-y-3 text-sm text-gray-700">
                  {disease.treatment.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl bg-red-50 px-4 py-3"
                    >
                      <span className="mr-2 font-bold text-red-500">
                        {index + 1}.
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ol>
              </section>

              <div className="mt-7 flex items-center justify-between rounded-2xl border border-[#5B4CF6]/20 bg-[#F7F5FF] p-4">
                <div>
                  <p className="font-bold text-[#5B4CF6]">
                    Не впевнені у діагнозі?
                  </p>
                  <p className="text-sm text-gray-500">
                    Спитайте у спільноті — допоможуть за хвилини
                  </p>
                </div>

                <motion.button
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl bg-[#5B4CF6] px-5 py-3 cursor-pointer text-sm font-bold text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)]"
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