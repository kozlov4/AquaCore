"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ReviewCard({ review, index, onOpen }) {
  const rating = review.rating || 5;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        scale: 1.015,
      }}
      whileTap={{ scale: 0.98 }}
      className="
        group cursor-pointer rounded-2xl border border-transparent
        bg-white p-5 text-left transition-all duration-300
        hover:border-gray-200
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
        focus:outline-none focus:ring-4 focus:ring-[#5B4CF6]/15
      "
    >
      <div className="mb-5 flex items-center gap-4 border-b border-gray-100 pb-5 sm:mb-6">
        <motion.div
          whileHover={{ rotate: 3, scale: 1.08 }}
          className="
            relative h-12 w-12 shrink-0 overflow-hidden rounded-full
            ring-4 ring-gray-100 transition
            group-hover:ring-[#5B4CF6]/20
          "
        >
          <Image
            src={review.avatar}
            alt={review.name}
            fill
            className="object-cover"
          />
        </motion.div>

        <h3 className="text-base font-bold text-[#171827] transition group-hover:text-[#5B4CF6] sm:text-lg">
          {review.name}
        </h3>
      </div>

      <div className="mb-4 flex gap-1 text-xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span
            key={star}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + star * 0.04 }}
            className={star <= rating ? "text-orange-500" : "text-gray-300"}
          >
            ★
          </motion.span>
        ))}
      </div>

      <p
        className="
          max-w-none whitespace-pre-line break-words
          text-sm leading-7 text-[#171827]/80
          sm:text-base lg:max-w-[310px]
          line-clamp-5
        "
      >
        {review.text}
      </p>

      <span className="mt-4 inline-flex text-sm font-black text-[#5B4CF6] transition group-hover:translate-x-1">
        Переглянути детальніше →
      </span>
    </motion.button>
  );
}