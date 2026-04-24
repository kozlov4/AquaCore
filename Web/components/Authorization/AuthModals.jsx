"use client";

import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 40,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 24,
    filter: "blur(6px)",
    transition: {
      duration: 0.22,
      ease: "easeIn",
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

const primaryButtonMotion = {
  whileHover: {
    scale: 1.04,
    y: -1,
    boxShadow: "0px 12px 30px rgba(33, 150, 243, 0.28)",
  },
  whileTap: {
    scale: 0.97,
  },
  transition: { type: "spring", stiffness: 320, damping: 20 },
};

const secondaryButtonMotion = {
  whileHover: {
    scale: 1.03,
    x: -1,
  },
  whileTap: {
    scale: 0.97,
  },
  transition: { type: "spring", stiffness: 320, damping: 22 },
};

const codeInputVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 + index * 0.04,
      duration: 0.25,
      ease: "easeOut",
    },
  }),
};

export function AuthModals({
  isForgotOpen,
  isSuccessOpen,
  isResetPasswordOpen,
  resetEmail,
  setResetEmail,
  closeForgotModal,
  handleSendReset,
  closeSuccessModal,
  handleOpenResetPasswordModal,
  closeResetPasswordModal,
  resetCode,
  handleCodeChange,
  handleCodeKeyDown,
  newPassword,
  setNewPassword,
  repeatPassword,
  setRepeatPassword,
  handleSavePassword,
}) {
  return (
    <>
      {/* 1 MODAL */}
      <AnimatePresence mode="wait">
        {isForgotOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/45"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeForgotModal}
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
                  onClick={closeForgotModal}
                  className="cursor-pointer text-sm font-medium text-[#2196F3] hover:underline"
                  {...secondaryButtonMotion}
                >
                  Скасувати
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSendReset}
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

      {/* 2 MODAL */}
      <AnimatePresence mode="wait">
        {isSuccessOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/45"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeSuccessModal}
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
                onClick={handleOpenResetPasswordModal}
                className="mt-10 cursor-pointer rounded-xl bg-[#2196F3] px-6 py-3 text-base font-semibold text-white"
                {...primaryButtonMotion}
              >
                Змінити пароль
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3 MODAL */}
      <AnimatePresence mode="wait">
        {isResetPasswordOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/45"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeResetPasswordModal}
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
                  onClick={closeResetPasswordModal}
                  className="cursor-pointer text-2xl font-medium text-[#2196F3] hover:underline"
                  {...secondaryButtonMotion}
                >
                  Скасувати
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSavePassword}
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
    </>
  );
}