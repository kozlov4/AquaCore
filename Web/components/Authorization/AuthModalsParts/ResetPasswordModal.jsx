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
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
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
            className="
              fixed left-1/2 top-1/2 z-50
              max-h-[92vh] w-[calc(100%-32px)]
              max-w-[720px] -translate-x-1/2 -translate-y-1/2
              overflow-y-auto rounded-[24px] bg-white
              px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]
              sm:w-[90%] sm:px-8 sm:py-8
              lg:px-10
            "
          >
            <motion.h2
              variants={childVariants}
              className="
                text-center text-2xl font-bold leading-tight text-[#2C2C2C]
                sm:text-3xl
              "
            >
              Створіть новий пароль
            </motion.h2>

            <motion.p
              variants={childVariants}
              className="
                mx-auto mt-5 max-w-[520px]
                text-center text-sm leading-6 text-gray-400
                sm:mt-8 sm:text-base
              "
            >
              Ми відправили 6-значний код на{" "}
              <span className="break-all font-medium text-gray-500">
                {resetEmail || "user@email.com"}
              </span>
            </motion.p>

            <motion.div
              variants={childVariants}
              className="
                mt-8 flex flex-col gap-4
                sm:mt-10
                lg:flex-row lg:items-center lg:gap-8
              "
            >
              <label
                className="
                  text-base font-semibold text-[#2C2C2C]
                  sm:text-lg
                  lg:min-w-[120px] lg:text-2xl
                "
              >
                Код з листа
              </label>

              <div
                className="
                  grid grid-cols-6 gap-2
                  sm:flex sm:gap-2
                "
              >
                {resetCode.map((digit, index) => (
                  <motion.input
                    key={index}
                    custom={index}
                    variants={codeInputVariants}
                    initial="hidden"
                    animate="visible"
                    id={`code-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    whileFocus={{
                      scale: 1.05,
                      borderColor: "#2196F3",
                      boxShadow: "0 0 0 4px rgba(33,150,243,0.15)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 20,
                    }}
                    className="
                      h-11 w-full rounded-xl border border-gray-400
                      text-center text-lg outline-none
                      transition-all duration-200
                      sm:h-12 sm:w-12 sm:text-xl
                    "
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={childVariants}
              className="
                mt-8 flex flex-col gap-3
                sm:mt-10
                lg:mt-14 lg:flex-row lg:items-center lg:gap-8
              "
            >
              <label
                className="
                  text-base font-semibold text-[#2C2C2C]
                  sm:text-lg
                  lg:min-w-[230px] lg:text-2xl
                "
              >
                Новий пароль
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введіть новий пароль"
                className="
                  w-full rounded-xl border border-gray-300
                  px-4 py-3 text-base outline-none
                  transition-all duration-200
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:shadow-[0_0_0_4px_rgba(33,150,243,0.12)]
                "
              />
            </motion.div>

            <motion.div
              variants={childVariants}
              className="
                mt-5 flex flex-col gap-3
                lg:mt-6 lg:flex-row lg:items-center lg:gap-8
              "
            >
              <label
                className="
                  text-base font-semibold text-[#2C2C2C]
                  sm:text-lg
                  lg:min-w-[230px] lg:text-2xl
                "
              >
                Повторіть новий пароль
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Повторіть пароль"
                className="
                  w-full rounded-xl border border-gray-300
                  px-4 py-3 text-base outline-none
                  transition-all duration-200
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:shadow-[0_0_0_4px_rgba(33,150,243,0.12)]
                "
              />
            </motion.div>

            <motion.div
              variants={childVariants}
              className="
                mt-8 flex flex-col-reverse gap-4
                sm:mt-10 sm:flex-row sm:items-center sm:justify-between
                lg:mt-12
              "
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="
                  cursor-pointer rounded-2xl px-4 py-3
                  text-center text-base font-medium text-[#2196F3]
                  transition-all duration-300 hover:bg-blue-50 hover:underline
                  sm:text-xl
                  lg:text-2xl
                "
                {...secondaryButtonMotion}
              >
                Скасувати
              </motion.button>

              <motion.button
                type="button"
                onClick={onSave}
                className="
                  w-full cursor-pointer rounded-2xl bg-[#2196F3]
                  px-6 py-3 text-base font-semibold text-white
                  shadow-lg shadow-blue-500/20
                  transition-all duration-300 hover:bg-[#1976D2]
                  sm:w-auto sm:text-xl
                  lg:px-8 lg:text-2xl
                "
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