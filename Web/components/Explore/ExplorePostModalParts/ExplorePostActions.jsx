"use client";

import { Heart, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { contentVariants, iconMotion } from "./explorePostAnimations";

export function ExplorePostActions({
  post,
  isLiked,
  setIsLiked,
  isSaved,
  setIsSaved,
  commentText,
  setCommentText,
  handleAddComment,
}) {
  return (
    <motion.div variants={contentVariants} className="border-t border-gray-200 px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            onClick={() => setIsLiked((prev) => !prev)}
            className={
              isLiked
                ? "text-red-500"
                : "cursor-pointer text-gray-800 hover:text-black"
            }
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.85 }}
            animate={isLiked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Heart size={22} fill={isLiked ? "currentColor" : "transparent"} />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setIsSaved((prev) => !prev)}
            className={
              isSaved
                ? "cursor-pointer text-orange-500"
                : "cursor-pointer text-gray-800 hover:text-black"
            }
            {...iconMotion}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "transparent"} />
          </motion.button>
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-900">
        {post.likes} вподобань
      </p>

      <div className="mt-3 flex items-center gap-3 border-t border-gray-200 pt-3">
        <motion.input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddComment();
          }}
          placeholder="Додати коментар..."
          whileFocus={{
            boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
          }}
          className="flex-1 rounded-lg border-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-gray-400"
        />

        <motion.button
          type="button"
          onClick={handleAddComment}
          className="cursor-pointer text-sm font-semibold text-[#2196F3] hover:opacity-80"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.96 }}
        >
          Опублікувати
        </motion.button>
      </div>
    </motion.div>
  );
}