"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReviewDetailsModal({ isOpen, review, onClose }) {
  if (!review) return null;

  const rating = review.rating || 5;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="
              fixed left-1/2 top-1/2 z-50
              w-[92vw] max-w-[620px]
              -translate-x-1/2 -translate-y-1/2
              overflow-hidden rounded-[28px] bg-white
              shadow-[0_30px_90px_rgba(15,23,42,0.25)]
            "
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5B4CF6]">
                  Детальний відгук
                </p>

                <h2 className="mt-1 text-xl font-black text-[#171827]">
                  {review.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-2xl text-gray-400 transition
                  hover:bg-gray-100 hover:text-gray-700
                "
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-4 ring-[#5B4CF6]/10">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#171827]">
                    {review.name}
                  </h3>

                  <div className="mt-2 flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= rating ? "text-orange-500" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="
                  max-h-[45vh] overflow-y-auto
                  rounded-3xl border border-gray-100 bg-gray-50
                  px-5 py-5
                "
              >
                <p
                  className="
                    whitespace-pre-line break-words
                    text-base leading-8 text-[#171827]/85
                  "
                >
                  {review.text}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    rounded-2xl bg-[#5B4CF6] px-6 py-3
                    text-sm font-black text-white
                    shadow-[0_16px_35px_rgba(91,76,246,0.28)]
                    transition hover:-translate-y-0.5 hover:bg-[#4f43df]
                  "
                >
                  Закрити
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ReviewDetailsModal;