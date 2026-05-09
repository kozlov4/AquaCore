"use client";

import { ReviewCard } from "../ReviewCard";

export function ReviewsGrid({ reviews }) {
  return (
    <section className="grid flex-1 grid-cols-3 gap-x-10 gap-y-10">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </section>
  );
}