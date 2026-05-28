"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";

import { FeedbackModal } from "./FeedbackModal";
import { FeedbackSuccessModal } from "./FeedbackSuccessModal";
import { ReviewDetailsModal } from "./ReviewDetailsModal";

import { useReviews } from "../../hooks/useReviews";

import { ReviewsHeader } from "./ReviewsParts/ReviewsHeader";
import { ReviewsGrid } from "./ReviewsParts/ReviewsGrid";
import { ReviewsFilter } from "./ReviewsParts/ReviewsFilter";
import { ReviewsFooter } from "./ReviewsParts/ReviewsFooter";

export function Reviews() {
  const reviews = useReviews();

  const [selectedReview, setSelectedReview] = useState(null);

  const handleOpenReviewDetails = (review) => {
    setSelectedReview(review);
  };

  const handleCloseReviewDetails = () => {
    setSelectedReview(null);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Sidebar />

      <motion.main
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="
          px-4 pb-28 pt-6
          sm:px-6 sm:pb-32 sm:pt-8
          lg:ml-[88px] lg:px-16 lg:py-16
        "
      >
        <div className="mx-auto max-w-[1120px]">
          <ReviewsHeader
            showAll={reviews.showAll}
            onShowAll={() => reviews.setShowAll(true)}
          />

          {reviews.isLoading && (
            <p className="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
              Завантаження відгуків...
            </p>
          )}

          {reviews.reviewsError && (
            <p className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
              {reviews.reviewsError}
            </p>
          )}

          {reviews.authMessage && (
            <p className="mb-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600">
              {reviews.authMessage}
            </p>
          )}

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <ReviewsGrid
              reviews={reviews.reviews}
              onOpenReview={handleOpenReviewDetails}
            />

            {reviews.showAll && (
              <ReviewsFilter
                selectedRating={reviews.selectedRating}
                setSelectedRating={reviews.setSelectedRating}
                selectedSort={reviews.selectedSort}
                setSelectedSort={reviews.setSelectedSort}
              />
            )}
          </div>

          <ReviewsFooter
            showAll={reviews.showAll}
            onBack={() => reviews.setShowAll(false)}
            onOpenFeedback={reviews.handleOpenFeedback}
          />
        </div>
      </motion.main>

      <FeedbackModal
        isOpen={reviews.isFeedbackOpen}
        onClose={() => reviews.setIsFeedbackOpen(false)}
        onSubmit={reviews.handleCreateFeedback}
      />

      <FeedbackSuccessModal
        isOpen={reviews.isSuccessOpen}
        onClose={() => reviews.setIsSuccessOpen(false)}
      />

      <ReviewDetailsModal
        isOpen={Boolean(selectedReview)}
        review={selectedReview}
        onClose={handleCloseReviewDetails}
      />
    </div>
  );
}

export default Reviews;