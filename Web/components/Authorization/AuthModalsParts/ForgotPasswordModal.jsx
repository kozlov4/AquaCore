"use client";

import { motion, AnimatePresence } from "framer-motion";

export function ForgotPasswordModal({
  isOpen,
  resetEmail,
  setResetEmail,
  onClose,
  onSend,
  isLoading,
  error,
}) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              w-[calc(100%-32px)] max-w-[460px]
              -translate-x-1/2 -translate-y-1/2
              rounded-2xl bg-white px-5 py-6
              shadow-[0_25px_80px_rgba(15,23,42,0.25)]
              sm:px-7 sm:py-7
            "
          >
            <h2 className="text-2xl font-bold text-[#171827]">
              Відновлення пароля
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Введіть email, який привʼязаний до акаунта. Ми відправимо код для
              зміни пароля.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-[#171827]">
                Email
              </label>

              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="user@example.com"
                className="
                  w-full rounded-xl border border-gray-200
                  px-4 py-3 text-sm outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#D688B7]
                  focus:ring-4 focus:ring-[#D688B7]/20
                "
              />
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-xl px-5 py-3 text-sm font-bold
                  text-gray-500 transition hover:bg-gray-50 hover:text-gray-900
                "
              >
                Скасувати
              </button>

              <motion.button
                type="button"
                onClick={onSend}
                disabled={isLoading}
                whileHover={isLoading ? {} : { y: -2 }}
                whileTap={isLoading ? {} : { scale: 0.96 }}
                className={`
                  rounded-xl px-6 py-3 text-sm font-bold text-white
                  transition
                  ${
                    isLoading
                      ? "cursor-not-allowed bg-[#D688B7]/60"
                      : "cursor-pointer bg-[#D688B7] hover:bg-[#c879aa]"
                  }
                `}
              >
                {isLoading ? "Надсилання..." : "Надіслати код"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}