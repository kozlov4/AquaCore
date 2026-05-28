"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { createOrUpdateFeedback, getFeedbacks } from "../services/feedbackApi";
import { getAccessToken } from "../services/apiClient";

const sortMap = {
  "Нові спочатку": "newest",
  "Найкращий рейтинг": "highest",
  "Найнижчий рейтинг": "lowest",
};

function mapApiFeedbackToReview(item, index) {
  return {
    id: `${item?.user?.nickname || "user"}-${index}`,
    name: item?.user?.nickname || "Користувач",
    avatar: item?.user?.avatar?.image_url || "/images/User.svg",
    rating: item?.rate || 5,
    text: item?.description || "",
  };
}

export function useReviews() {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState("Нові спочатку");

  const [isLoading, setIsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const minRate = selectedRating || 0;
  const sortBy = sortMap[selectedSort] || "newest";
  const limit = showAll ? 100 : 6;

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setReviewsError("");

      const data = await getFeedbacks({
        limit,
        offset: 0,
        minRate,
        sortBy,
      });

      const mappedReviews = Array.isArray(data)
        ? data.map(mapApiFeedbackToReview)
        : [];

      setReviews(mappedReviews);
    } catch (error) {
      setReviewsError(error.message || "Помилка завантаження відгуків");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [showAll, selectedRating, selectedSort]);

  const handleOpenFeedback = () => {
    setAuthMessage("");

    const token = getAccessToken();

    if (!token) {
      setAuthMessage("Щоб залишити відгук, потрібно увійти в акаунт.");

      setTimeout(() => {
        router.push("/signIn");
      }, 800);

      return;
    }

    setIsFeedbackOpen(true);
  };

  const handleCreateFeedback = async ({ rating, text }) => {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Щоб залишити відгук, потрібно увійти в акаунт");
    }

    await createOrUpdateFeedback({
      rate: rating,
      description: text,
    });

    setIsFeedbackOpen(false);
    setIsSuccessOpen(true);

    await loadReviews();
  };

  const handleFeedbackSuccess = () => {
    setIsFeedbackOpen(false);
    setIsSuccessOpen(true);
  };

  const visibleReviews = useMemo(() => {
    return reviews;
  }, [reviews]);

  return {
    reviews: visibleReviews,

    showAll,
    setShowAll,

    isFeedbackOpen,
    setIsFeedbackOpen,

    isSuccessOpen,
    setIsSuccessOpen,

    selectedRating,
    setSelectedRating,

    selectedSort,
    setSelectedSort,

    isLoading,
    reviewsError,
    authMessage,

    loadReviews,
    handleOpenFeedback,
    handleCreateFeedback,
    handleFeedbackSuccess,
  };
}