"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { contentVariants } from "./explorePostAnimations";

export function ExplorePostComments({
  post,
  comments,
  likedComments,
  toggleCommentLike,
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <motion.div variants={contentVariants} className="mb-5 flex items-start gap-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image src={post.avatar} alt={post.userName} fill className="object-cover" />
        </div>

        <div className="text-sm">
          <p className="text-gray-900">
            <span className="font-semibold">{post.userName}</span>{" "}
            {post.description}
          </p>
          <p className="mt-1 text-xs text-gray-400">1 год • 4 дні тому</p>
        </div>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((comment) => {
            const isCommentLiked = likedComments.includes(comment.id);

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-start gap-3"
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src="/images/Avatar.png"
                    alt={comment.user}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 text-sm">
                  <p className="text-gray-900">
                    <span className="font-semibold">{comment.user}</span>{" "}
                    {comment.text}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{comment.time}</p>
                </div>

                <motion.button
                  type="button"
                  onClick={() => toggleCommentLike(comment.id)}
                  className={
                    isCommentLiked
                      ? "cursor-pointer text-red-500"
                      : "cursor-pointer text-gray-400 hover:text-gray-600"
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  animate={isCommentLiked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Heart
                    size={14}
                    fill={isCommentLiked ? "currentColor" : "transparent"}
                  />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}