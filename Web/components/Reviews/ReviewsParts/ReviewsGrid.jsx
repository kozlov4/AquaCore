"use client";

import { ReviewCard } from "../ReviewCard";

export function ReviewsGrid({ reviews, onOpenReview }) {
  return (
    <section
      className="
        grid flex-1 grid-cols-1 gap-5
        sm:grid-cols-2 sm:gap-6
        xl:grid-cols-3 xl:gap-x-10 xl:gap-y-10
      "
    >
      {reviews.map((review, index) => (
        <ReviewCard
          key={review.id}
          review={review}
          index={index}
          onOpen={() => onOpenReview?.(review)}
        />
      ))}
    </section>
  );
}