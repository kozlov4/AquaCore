"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  backdropVariants,
  modalVariants,
  childVariants,
  primaryButtonMotion,
} from "./modalAnimations";

export function SuccessResetModal({ isOpen, onClose, onOpenReset }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/45"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-6 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
          >
            <motion.h2
              variants={childVariants}
              className="text-2xl font-bold text-[#2C2C2C]"
            >
              Повідомлення надіслано
            </motion.h2>

            <motion.p
              variants={childVariants}
              className="mt-3 text-sm text-gray-400"
            >
              Ми відправили код підтвердження на вашу електронну пошту.
            </motion.p>

            <motion.button
              variants={childVariants}
              type="button"
              onClick={onOpenReset}
              className="mt-10 cursor-pointer rounded-xl bg-[#2196F3] px-6 py-3 text-base font-semibold text-white"
              {...primaryButtonMotion}
            >
              Змінити пароль
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}