"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Bookmark, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 12,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const iconMotion = {
  whileHover: { scale: 1.08, y: -1 },
  whileTap: { scale: 0.92 },
  transition: { type: "spring", stiffness: 320, damping: 20 },
};

export function ExplorePostModal({ post, onClose }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likedComments, setLikedComments] = useState([]);

  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
      setCommentText("");
      setIsLiked(false);
      setIsSaved(false);
    }
  }, [post]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (post) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [post, onClose]);

  if (!post) return null;

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "you",
      text: commentText.trim(),
      time: "щойно",
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const toggleCommentLike = (commentId) => {
    setLikedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId],
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />

      <motion.div
        className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-white shadow-2xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          variants={contentVariants}
          className="relative hidden h-full flex-1 bg-black md:block"
        >
          <Image
            src={post.image}
            alt={post.alt}
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="flex h-full w-full flex-col md:w-[420px]">
          <motion.div
            variants={contentVariants}
            className="flex items-center justify-between border-b border-gray-200 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={post.avatar}
                  alt={post.userName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {post.userName}
                </p>
                <p className="text-xs text-gray-400">{post.location}</p>
              </div>
            </div>

            <motion.button
              type="button"
              className="text-gray-600 hover:text-black"
              {...iconMotion}
            >
              <MoreHorizontal size={18} />
            </motion.button>
          </motion.div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <motion.div
              variants={contentVariants}
              className="mb-5 flex items-start gap-3"
            >
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={post.avatar}
                  alt={post.userName}
                  fill
                  className="object-cover"
                />
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
                {comments.map((comment) => (
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
                      <p className="mt-1 text-xs text-gray-400">
                        {comment.time}
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => toggleCommentLike(comment.id)}
                      className={
                        likedComments.includes(comment.id)
                          ? "text-red-500 cursor-pointer"
                          : "text-gray-400 hover:text-gray-600 cursor-pointer"
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      animate={
                        likedComments.includes(comment.id)
                          ? { scale: [1, 1.25, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.25 }}
                    >
                      <Heart
                        size={14}
                        fill={
                          likedComments.includes(comment.id)
                            ? "currentColor"
                            : "transparent"
                        }
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            variants={contentVariants}
            className="border-t border-gray-200 px-4 py-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  type="button"
                  onClick={() => setIsLiked((prev) => !prev)}
                  className={
                    isLiked
                      ? "text-red-500"
                      : "text-gray-800 hover:text-black cursor-pointer"
                  }
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.85 }}
                  animate={isLiked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Heart
                    size={22}
                    fill={isLiked ? "currentColor" : "transparent"}
                  />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setIsSaved((prev) => !prev)}
                  className={
                    isSaved
                      ? "text-orange-500"
                      : "text-gray-800 hover:text-black cursor-pointer"
                  }
                  {...iconMotion}
                >
                  <Bookmark
                    size={20}
                    fill={isSaved ? "currentColor" : "transparent"}
                  />
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
                className="text-sm font-semibold cursor-pointer text-[#2196F3] hover:opacity-80"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.96 }}
              >
                Опублікувати
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
