"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  backdropVariants,
  modalVariants,
  childVariants,
  primaryButtonMotion,
  secondaryButtonMotion,
  codeInputVariants,
} from "./modalAnimations";

export function ResetPasswordModal({
  isOpen,
  resetEmail,
  resetCode,
  handleCodeChange,
  handleCodeKeyDown,
  newPassword,
  setNewPassword,
  repeatPassword,
  setRepeatPassword,
  onClose,
  onSave,
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
            className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
          >
            <motion.h2
              variants={childVariants}
              className="text-center text-3xl font-bold text-[#2C2C2C]"
            >
              Створіть новий пароль
            </motion.h2>

            <motion.p
              variants={childVariants}
              className="mt-8 text-center text-base text-gray-400"
            >
              Ми відправили 6-значний код на {resetEmail || "user@email.com"}
            </motion.p>

            <motion.div
              variants={childVariants}
              className="mt-10 flex items-center gap-8"
            >
              <label className="min-w-[120px] text-2xl font-semibold text-[#2C2C2C]">
                Код з листа
              </label>

              <div className="flex gap-2">
                {resetCode.map((digit, index) => (
                  <motion.input
                    key={index}
                    custom={index}
                    variants={codeInputVariants}
                    initial="hidden"
                    animate="visible"
                    id={`code-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    whileFocus={{
                      scale: 1.08,
                      borderColor: "#2196F3",
                      boxShadow: "0 0 0 4px rgba(33,150,243,0.15)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 20,
                    }}
                    className="h-[48px] w-[48px] rounded-xl border border-gray-400 text-center text-xl outline-none"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={childVariants}
              className="mt-14 flex items-center gap-8"
            >
              <label className="min-w-[230px] text-2xl font-semibold text-[#2C2C2C]">
                Новий пароль
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(33,150,243,0.12)]"
              />
            </motion.div>

            <motion.div
              variants={childVariants}
              className="mt-6 flex items-center gap-8"
            >
              <label className="min-w-[230px] text-2xl font-semibold text-[#2C2C2C]">
                Повторіть новий пароль
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(33,150,243,0.12)]"
              />
            </motion.div>

            <motion.div
              variants={childVariants}
              className="mt-12 flex items-center justify-between"
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-2xl font-medium text-[#2196F3] hover:underline"
                {...secondaryButtonMotion}
              >
                Скасувати
              </motion.button>

              <motion.button
                type="button"
                onClick={onSave}
                className="cursor-pointer rounded-2xl bg-[#2196F3] px-8 py-3 text-2xl font-semibold text-white"
                {...primaryButtonMotion}
              >
                Зберегти пароль
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}