"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FeedbackModal({ isOpen, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!rating || !text.trim()) {
      alert("Оцініть сервіс і напишіть відгук");
      return;
    }

    setRating(0);
    setText("");
    onSuccess();
  };

  const handleClear = () => {
    setRating(0);
    setText("");
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
            className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-6 py-6 shadow-[0_25px_80px_rgba(15,23,42,0.25)]"
          >
            <h2 className="text-2xl font-bold text-[#171827]">
              Ми будемо раді отримати ваші відгуки
            </h2>

            <p className="mt-2 text-sm text-gray-500">
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
                className="h-[120px] w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {text.length}/500
              </p>
            </div>

            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(91,76,246,.28)" }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 w-full rounded-xl bg-[#5B4CF6] py-3 text-sm font-semibold text-white transition hover:bg-[#4d3feb]"
            >
              Надіслати відгук
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