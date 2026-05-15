"use client";

import { motion, AnimatePresence } from "framer-motion";

export function DeleteAquariumModal({ aquarium, onClose, onConfirm, isLoading }) {
  return (
    <AnimatePresence mode="wait">
      {aquarium && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22 }}
            className="
              fixed left-1/2 top-1/2 z-[110]
              w-[calc(100%-32px)] max-w-[380px]
              -translate-x-1/2 -translate-y-1/2
              rounded-2xl bg-white p-6 text-center
              shadow-[0_25px_80px_rgba(15,23,42,0.28)]
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
              🗑️
            </div>

            <h2 className="mt-5 text-lg font-black text-slate-950">
              Видалити акваріум?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ви збираєтесь видалити{" "}
              <span className="font-bold text-slate-700">
                “{aquarium.name}”
              </span>
              . Цю дію неможливо буде скасувати.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="
                  rounded-xl border border-slate-200 px-4 py-3
                  text-sm font-black text-slate-600
                  transition hover:bg-slate-50
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                Скасувати
              </button>

              <motion.button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                whileTap={isLoading ? {} : { scale: 0.96 }}
                className={`
                  rounded-xl px-4 py-3 text-sm font-black text-white
                  transition
                  ${
                    isLoading
                      ? "cursor-not-allowed bg-red-400"
                      : "cursor-pointer bg-red-500 hover:bg-red-600"
                  }
                `}
              >
                {isLoading ? "Видалення..." : "Так, видалити"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}