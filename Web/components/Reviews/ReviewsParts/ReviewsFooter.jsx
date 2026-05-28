"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { motion } from "framer-motion";

export function ReviewsFooter({ showAll, onBack, onOpenFeedback }) {
  return (
    <div
      className="
        mt-10 flex justify-start
        sm:mt-14
        lg:mt-20 lg:justify-end
      "
    >
      {showAll ? (
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.98 }}
          className="
            flex cursor-pointer items-center gap-2
            rounded-2xl bg-[#5B4CF6] px-5 py-3
            text-sm font-black text-white
            shadow-[0_16px_35px_rgba(91,76,246,0.25)]
            transition hover:bg-[#4f43df]
            sm:text-base
          "
        >
          <ArrowLeft size={18} />
          Повернутись назад
        </motion.button>
      ) : (
        <motion.button
          type="button"
          onClick={onOpenFeedback}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="
            flex cursor-pointer items-center gap-2
            text-sm font-semibold text-[#5B4CF6]
            sm:text-base
          "
        >
          Залишити відгук
          <ArrowRight size={18} />
        </motion.button>
      )}
    </div>
  );
}