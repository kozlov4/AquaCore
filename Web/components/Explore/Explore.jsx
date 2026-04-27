"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { Header } from "../Profile/Header";
import { ExploreGrid } from "./ExploreGrid";
import { ExplorePostModal } from "./ExplorePostModal";

const explorePosts = [
  {
    id: 1,
    image: "/images/Car.jpg",
    alt: "post-1",
    userName: "denys_kukulenko",
    avatar: "/images/Avatar.png",
    location: "Головний травник",
    likes: 83,
    description: "Моя краса 🐠✨",
    comments: [
      {
        id: 1,
        user: "pum_kyiv",
        text: "Вау, дуже гарно виглядає, реально атмосферно 😍",
        time: "1 д",
      },
      {
        id: 2,
        user: "nita_aquatic",
        text: "Ех, вигляд як справжній підводний світ, дуже атмосферно ✨",
        time: "2 д",
      },
      {
        id: 3,
        user: "sigma",
        text: "Дуже крутий акваріум, реально виглядає просто шикарно 😍",
        time: "2 д",
      },
      {
        id: 4,
        user: "lion_reef",
        text: "Супер акваріум, декор видно свіжо і дуже гармонійно 👌",
        time: "4 д",
      },
    ],
  },
  {
    id: 2,
    image: "/images/Car.jpg",
    alt: "post-2",
    userName: "reef_world",
    avatar: "/images/Avatar.png",
    location: "Kyiv",
    likes: 142,
    description: "Нова композиція для морського акваріума 🌊",
    comments: [
      {
        id: 1,
        user: "aqua_life",
        text: "Кольори просто космос",
        time: "3 г",
      },
    ],
  },
  {
    id: 3,
    image: "/images/Car.jpg",
    alt: "post-3",
    userName: "nano_fish",
    avatar: "/images/Avatar.png",
    location: "Lviv",
    likes: 56,
    description: "Мій маленький куточок природи 🌿",
    comments: [],
  },
  { id: 4, image: "/images/Car.jpg", alt: "post-4", userName: "aqua_ua", avatar: "/images/Avatar.png", location: "Odesa", likes: 97, description: "Акваріумний вайб", comments: [] },
  { id: 5, image: "/images/Car.jpg", alt: "post-5", userName: "blue_reef", avatar: "/images/Avatar.png", location: "Kharkiv", likes: 33, description: "Ніжні кольори", comments: [] },
  { id: 6, image: "/images/Car.jpg", alt: "post-6", userName: "fish_house", avatar: "/images/Avatar.png", location: "Dnipro", likes: 61, description: "Нове фото", comments: [] },
  { id: 7, image: "/images/Car.jpg", alt: "post-7", userName: "reef_time", avatar: "/images/Avatar.png", location: "Kyiv", likes: 121, description: "Морська глибина", comments: [] },
  { id: 8, image: "/images/Car.jpg", alt: "post-8", userName: "plant_aqua", avatar: "/images/Avatar.png", location: "Lutsk", likes: 45, description: "Рослинний акваріум", comments: [] },
  { id: 9, image: "/images/Car.jpg", alt: "post-9", userName: "gold_fish", avatar: "/images/Avatar.png", location: "Poltava", likes: 77, description: "Рибки в кадрі", comments: [] },
  { id: 10, image: "/images/Car.jpg", alt: "post-10", userName: "reef_story", avatar: "/images/Avatar.png", location: "Vinnytsia", likes: 24, description: "Новий пост", comments: [] },
  { id: 11, image: "/images/Car.jpg", alt: "post-11", userName: "coral_hub", avatar: "/images/Avatar.png", location: "Ternopil", likes: 93, description: "Корали", comments: [] },
  { id: 12, image: "/images/Car.jpg", alt: "post-12", userName: "aqua_decor", avatar: "/images/Avatar.png", location: "Rivne", likes: 110, description: "Декор", comments: [] },
];

const pageVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};

export function Explore() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <motion.div
      className="min-h-screen bg-white"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Sidebar />

      <div className="ml-[88px]">
        <Header />

        <main className="px-8 py-8">
          <motion.div
            className="mx-auto max-w-[980px]"
            variants={contentVariants}
          >
            <ExploreGrid posts={explorePosts} onOpenPost={setSelectedPost} />
          </motion.div>
        </main>
      </div>

      <AnimatePresence mode="wait">
        {selectedPost && (
          <ExplorePostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}