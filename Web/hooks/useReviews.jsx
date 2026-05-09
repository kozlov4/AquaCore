"use client";

import { useState } from "react";

const baseReviews = [
  {
    id: 1,
    name: "Bimosaurus",
    avatar: "/images/Avatar.png",
    rating: 5,
    text: "I’ve used other kits, but this one is the best. The attention to detail and usability are truly amazing.",
  },
  {
    id: 2,
    name: "Crystal Maiden",
    avatar: "/images/Avatar.png",
    rating: 5,
    text: "The quality of the design is top-notch, and I love how organized the files are. It’s easy to find what I need.",
  },
  {
    id: 3,
    name: "Dazzle Healer",
    avatar: "/images/Avatar.png",
    rating: 5,
    text: "This kit exceeded my expectations! The components are versatile and make implementation much easier.",
  },
  {
    id: 4,
    name: "Roshan Pro Max",
    avatar: "/images/Avatar.png",
    rating: 5,
    text: "Perfect for quick prototyping! The designs are professional and work seamlessly with my workflow.",
  },
  {
    id: 5,
    name: "Mirana Marci",
    avatar: "/images/Avatar.png",
    rating: 5,
    text: "I was blown away by how complete this UI Kit is. It has everything I need, from assets to components.",
  },
  {
    id: 6,
    name: "Hearts of Taras",
    avatar: "/images/Avatar.png",
    rating: 5,
    text: "Amazing work! The color schemes are vibrant, and the icons fit perfectly with all my projects.",
  },
];

const allReviews = Array.from({ length: 5 }).flatMap((_, index) =>
  baseReviews.map((review) => ({
    ...review,
    id: `${review.id}-${index}`,
  }))
);

export function useReviews() {
  const [showAll, setShowAll] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const reviews = showAll ? allReviews : baseReviews;

  const handleFeedbackSuccess = () => {
    setIsFeedbackOpen(false);
    setIsSuccessOpen(true);
  };

  return {
    showAll,
    setShowAll,
    isFeedbackOpen,
    setIsFeedbackOpen,
    isSuccessOpen,
    setIsSuccessOpen,
    reviews,
    handleFeedbackSuccess,
  };
}