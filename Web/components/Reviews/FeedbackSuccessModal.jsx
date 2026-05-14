"use client";

import { motion, AnimatePresence } from "framer-motion";

export function FeedbackSuccessModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              flex max-h-[92vh] min-h-[360px]
              w-[calc(100%-28px)] max-w-[760px]
              -translate-x-1/2 -translate-y-1/2
              flex-col items-center justify-center
              rounded-2xl bg-white px-5 py-10 text-center
              shadow-[0_25px_80px_rgba(15,23,42,0.25)]
              sm:min-h-[440px] sm:px-8
              lg:h-[520px]
            "
          >
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="
                text-2xl font-bold leading-tight text-[#171827]
                sm:text-3xl
                lg:text-4xl
              "
            >
              Дякуємо за ваш відгук!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="
                mt-4 text-base leading-7 text-gray-500
                sm:text-xl
                lg:text-2xl
              "
            >
              Ми цінуємо ваш зворотній зв’язок
            </motion.p>

            <motion.button
              type="button"
              onClick={onClose}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              whileHover={{
                y: -2,
                boxShadow: "0 14px 30px rgba(91,76,246,.28)",
              }}
              whileTap={{ scale: 0.98 }}
              className="
                mt-14 cursor-pointer rounded-xl bg-[#5B4CF6]
                px-8 py-3 text-base font-semibold text-white
                transition hover:bg-[#4d3feb]
                sm:mt-20 sm:px-10 sm:py-4 sm:text-lg
                lg:mt-28 lg:px-12
              "
            >
              Повернутись
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}