"use client";

import { motion, AnimatePresence } from "framer-motion";

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
  isLoading,
  error,
  success,
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
              max-h-[92vh] w-[calc(100%-32px)] max-w-[720px]
              -translate-x-1/2 -translate-y-1/2
              overflow-y-auto rounded-2xl bg-white
              px-5 py-6 shadow-[0_25px_80px_rgba(15,23,42,0.25)]
              sm:px-8 sm:py-8
            "
          >
            <h2 className="text-center text-2xl font-bold text-[#171827] sm:text-3xl">
              Створіть новий пароль
            </h2>

            <p className="mx-auto mt-5 max-w-[520px] text-center text-sm leading-6 text-gray-500">
              Ми відправили 6-значний код на{" "}
              <span className="break-all font-semibold text-gray-700">
                {resetEmail}
              </span>
            </p>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-bold text-[#171827]">
                Код з листа
              </label>

              <div className="grid grid-cols-6 gap-2">
                {resetCode.map((digit, index) => (
                  <motion.input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    whileFocus={{
                      scale: 1.05,
                      borderColor: "#D688B7",
                      boxShadow: "0 0 0 4px rgba(214,136,183,0.16)",
                    }}
                    className="
                      h-12 w-full rounded-xl border border-gray-300
                      text-center text-xl font-bold outline-none
                    "
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-bold text-[#171827]">
                Новий пароль
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Мінімум 8 символів"
                className="
                  w-full rounded-xl border border-gray-200
                  px-4 py-3 text-sm outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#D688B7]
                  focus:ring-4 focus:ring-[#D688B7]/20
                "
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-[#171827]">
                Повторіть новий пароль
              </label>

              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Повторіть пароль"
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
              <p className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                {error}
              </p>
            )}

            {success && (
              <p className="mt-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                {success}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                onClick={onSave}
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
                {isLoading ? "Збереження..." : "Зберегти пароль"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}