"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      if (!rating || !text.trim()) {
        setError("Оцініть сервіс і напишіть відгук");
        return;
      }

      setIsSending(true);

      await onSubmit({
        rating,
        text: text.trim(),
      });

      setRating(0);
      setText("");
    } catch (error) {
      setError(error.message || "Не вдалося надіслати відгук");
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setRating(0);
    setText("");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              max-h-[92vh] w-[calc(100%-28px)]
              max-w-[500px] -translate-x-1/2 -translate-y-1/2
              overflow-y-auto rounded-2xl bg-white
              px-5 py-6 shadow-[0_25px_80px_rgba(15,23,42,0.25)]
              sm:px-6
            "
          >
            <h2 className="text-xl font-bold leading-tight text-[#171827] sm:text-2xl">
              Ми будемо раді отримати ваші відгуки
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Допоможіть нам покращити якість наших послуг
            </p>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-[#171827]">
                Як би ви оцінили наш сервіс?{" "}
                <span className="text-red-500">*</span>
              </p>

              <div className="flex gap-1 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2, rotate: -6 }}
                    whileTap={{ scale: 0.9 }}
                    className={`transition ${
                      star <= rating ? "text-orange-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-[#171827]">
                Розкажіть нам більше про свій досвід
              </p>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 500))}
                placeholder="Поділіться своїми думками, пропозиціями чи зауваженнями..."
                className="
                  h-[120px] w-full resize-none rounded-xl
                  border border-gray-200 px-4 py-3
                  text-sm outline-none transition
                  focus:border-[#5B4CF6]
                  focus:ring-4 focus:ring-[#5B4CF6]/10
                "
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {text.length}/500
              </p>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                {error}
              </p>
            )}

            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSending}
              whileHover={
                isSending
                  ? {}
                  : {
                      y: -2,
                      boxShadow: "0 14px 30px rgba(91,76,246,.28)",
                    }
              }
              whileTap={isSending ? {} : { scale: 0.98 }}
              className={`
                mt-5 w-full rounded-xl py-3 text-sm font-semibold
                text-white transition
                ${
                  isSending
                    ? "cursor-not-allowed bg-[#5B4CF6]/60"
                    : "cursor-pointer bg-[#5B4CF6] hover:bg-[#4d3feb]"
                }
              `}
            >
              {isSending ? "Надсилання..." : "Надіслати відгук"}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleClear}
              whileHover={{ y: -1 }}
              className="mt-4 w-full text-sm text-gray-500 transition hover:text-gray-900"
            >
              Очистити форму
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}