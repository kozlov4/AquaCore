"use client";

import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import { postVariants, iconMotion } from "./feedAnimations";
import { RecommendationsBlock } from "./RecommendationsBlock";

export function PostCard({
  post,
  showRecommendations = false,
  index,
  likedPosts,
  toggleLike,
  openPostModal,
  openCommentsModal,
  savedPosts,
  toggleSave,
}) {
  const isLiked = likedPosts.includes(post.id);
  const isSaved = savedPosts.includes(post.id);

  return (
    <motion.article
      custom={index}
      variants={postVariants}
      initial="hidden"
      animate="visible"
      className="mb-12 w-full max-w-[470px]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="relative h-8 w-8 overflow-hidden rounded-full"
          >
            <Image
              src={post.avatar}
              alt={post.userName}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="flex items-center gap-1 text-sm text-gray-900">
            <span className="font-semibold">{post.userName}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{post.time}</span>
          </div>
        </div>

        <motion.button
          type="button"
          className="text-gray-600 hover:text-black"
          {...iconMotion}
        >
          <MoreHorizontal size={18} />
        </motion.button>
      </div>

      <motion.div
        className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-sm bg-gray-100"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={() => openPostModal(post)}
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full w-full"
        >
          <Image
            src={post.image}
            alt={post.userName}
            fill
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            onClick={() => toggleLike(post.id)}
            className={`cursor-pointer ${
              isLiked ? "text-red-500" : "text-gray-800 hover:text-black"
            }`}
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.85 }}
            animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Heart size={22} fill={isLiked ? "currentColor" : "transparent"} />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => openCommentsModal(post)}
            className="cursor-pointer text-gray-800 hover:text-black"
            {...iconMotion}
          >
            <MessageCircle size={22} />
          </motion.button>
        </div>

        <motion.button
          type="button"
          onClick={() => toggleSave(post.id)}
          className={
            isSaved
              ? "cursor-pointer text-orange-500"
              : "cursor-pointer text-gray-800 hover:text-black"
          }
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={{ scale: 0.85 }}
          animate={isSaved ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Bookmark
            size={20}
            fill={isSaved ? "currentColor" : "transparent"}
          />
        </motion.button>
      </div>

      <div className="mt-3 text-sm text-gray-900">
        <p className="font-semibold">{post.likes} вподобань</p>

        <p className="mt-1">
          <span className="font-semibold">{post.userName}</span> {post.caption}
        </p>
      </div>

      {showRecommendations && <RecommendationsBlock />}
    </motion.article>
  );
}