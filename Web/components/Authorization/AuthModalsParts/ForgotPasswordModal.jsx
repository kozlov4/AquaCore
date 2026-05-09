"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  backdropVariants,
  modalVariants,
  childVariants,
  primaryButtonMotion,
  secondaryButtonMotion,
} from "./modalAnimations";

export function ForgotPasswordModal({
  isOpen,
  resetEmail,
  setResetEmail,
  onClose,
  onSend,
}) {
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
            className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
          >
            <motion.h2
              variants={childVariants}
              className="text-center text-2xl font-bold text-[#2C2C2C]"
            >
              Відновлення пароля
            </motion.h2>

            <motion.p
              variants={childVariants}
              className="mt-4 text-center text-sm text-gray-400"
            >
              Введіть email, на який зареєстрований ваш акаунт. Ми відправимо
              код підтвердження.
            </motion.p>

            <motion.div variants={childVariants} className="mt-6">
              <label className="mb-2 block text-base font-semibold text-[#2C2C2C]">
                Email
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(33,150,243,0.12)]"
              />
            </motion.div>

            <motion.div
              variants={childVariants}
              className="mt-8 flex items-center justify-between"
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-sm font-medium text-[#2196F3] hover:underline"
                {...secondaryButtonMotion}
              >
                Скасувати
              </motion.button>

              <motion.button
                type="button"
                onClick={onSend}
                className="cursor-pointer rounded-xl bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white"
                {...primaryButtonMotion}
              >
                Надіслати
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}