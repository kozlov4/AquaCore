"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { ReviewCard } from "./ReviewCard";
import { FeedbackModal } from "./FeedbackModal";
import { FeedbackSuccessModal } from "./FeedbackSuccessModal";

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

export function Reviews() {
  const [showAll, setShowAll] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const reviews = showAll ? allReviews : baseReviews;

  const handleFeedbackSuccess = () => {
    setIsFeedbackOpen(false);
    setIsSuccessOpen(true);
  };

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
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 flex items-start justify-between"
          >
            <div>
              <p className="mb-2 text-sm font-semibold text-[#5B4CF6]">
                Відгуки клієнтів
              </p>

              <h1 className="max-w-[900px] text-4xl font-bold leading-tight tracking-tight text-[#171827]">
                Що Кажуть Користувачі Після Використання Нашого Продукту
              </h1>
            </div>

            {!showAll && (
              <motion.button
                type="button"
                onClick={() => setShowAll(true)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex items-center gap-2 cursor-pointer text-base font-semibold text-[#5B4CF6]"
              >
                Дивитись всі
                <ArrowRight size={18} />
              </motion.button>
            )}
          </motion.div>

          <div className="flex gap-12">
            <section className="grid flex-1 grid-cols-3 gap-x-10 gap-y-10">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </section>

            {showAll && (
              <motion.aside
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="sticky top-8 h-fit w-[230px] shrink-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <h3 className="mb-6 text-lg font-bold text-[#171827]">
                  Фільтр
                </h3>

                <div className="mb-8">
                  <p className="mb-3 text-sm font-semibold text-[#171827]">
                    Оцінка
                  </p>

                  {[5, 4, 3, 2].map((rating, index) => (
                    <label
                      key={rating}
                      className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#171827] transition hover:text-[#5B4CF6]"
                    >
                      <input
                        type="radio"
                        name="rating"
                        defaultChecked={index === 0}
                        className="accent-[#5B4CF6]"
                      />
                      <span className="text-orange-500">
                        {"★".repeat(rating)}
                      </span>
                      <span>і вище</span>
                    </label>
                  ))}
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-[#171827]">
                    Сортувати за
                  </p>

                  {["Нові спочатку", "Найкращий рейтинг", "Найнижчий рейтинг"].map(
                    (item, index) => (
                      <label
                        key={item}
                        className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#171827] transition hover:text-[#5B4CF6]"
                      >
                        <input
                          type="radio"
                          name="sort"
                          defaultChecked={index === 0}
                          className="accent-[#5B4CF6]"
                        />
                        {item}
                      </label>
                    )
                  )}
                </div>
              </motion.aside>
            )}
          </div>

          <div className="mt-20 flex justify-end">
            {showAll ? (
              <motion.button
                type="button"
                onClick={() => setShowAll(false)}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 cursor-pointer text-base font-semibold text-[#2196F3]"
              >
                <ArrowLeft size={18} />
                Повернутись назад
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-base font-semibold text-[#5B4CF6]"
              >
                Залишити відгук
                <ArrowRight size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.main>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSuccess={handleFeedbackSuccess}
      />

      <FeedbackSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
}