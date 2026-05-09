"use client";

import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { FeedbackModal } from "./FeedbackModal";
import { FeedbackSuccessModal } from "./FeedbackSuccessModal";
import { useReviews } from "../../hooks/useReviews";
import { ReviewsHeader } from "./ReviewsParts/ReviewsHeader";
import { ReviewsGrid } from "./ReviewsParts/ReviewsGrid";
import { ReviewsFilter } from "./ReviewsParts/ReviewsFilter";
import { ReviewsFooter } from "./ReviewsParts/ReviewsFooter";

export function Reviews() {
  const reviews = useReviews();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <motion.main
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="ml-[88px] px-16 py-16"
      >
        <div className="mx-auto max-w-[1120px]">
          <ReviewsHeader
            showAll={reviews.showAll}
            onShowAll={() => reviews.setShowAll(true)}
          />

          <div className="flex gap-12">
            <ReviewsGrid reviews={reviews.reviews} />

            {reviews.showAll && <ReviewsFilter />}
          </div>

          <ReviewsFooter
            showAll={reviews.showAll}
            onBack={() => reviews.setShowAll(false)}
            onOpenFeedback={() => reviews.setIsFeedbackOpen(true)}
          />
        </div>
      </motion.main>

      <FeedbackModal
        isOpen={reviews.isFeedbackOpen}
        onClose={() => reviews.setIsFeedbackOpen(false)}
        onSuccess={reviews.handleFeedbackSuccess}
      />

      <FeedbackSuccessModal
        isOpen={reviews.isSuccessOpen}
        onClose={() => reviews.setIsSuccessOpen(false)}
      />
    </div>
  );
}