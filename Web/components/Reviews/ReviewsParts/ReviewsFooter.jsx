"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ReviewsFooter({ showAll, onBack, onOpenFeedback }) {
  return (
    <div className="mt-20 flex justify-end">
      {showAll ? (
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.98 }}
          className="flex cursor-pointer items-center gap-2 text-base font-semibold text-[#2196F3]"
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
          className="flex cursor-pointer items-center gap-2 text-base font-semibold text-[#5B4CF6]"
        >
          Залишити відгук
          <ArrowRight size={18} />
        </motion.button>
      )}
    </div>
  );
}