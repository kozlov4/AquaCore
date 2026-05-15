"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { modalBackdrop, modalContent } from "./feedAnimations";

export function CommentsModal({ post, onClose, onAddComment }) {
  const [commentValue, setCommentValue] = useState("");

  if (!post) return null;

  const handleSubmit = () => {
    const trimmed = commentValue.trim();

    if (!trimmed) return;

    onAddComment(post.id, trimmed);
    setCommentValue("");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-black/60"
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 w-[92%] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-2xl"
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Коментарі</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={post.avatar}
                alt={post.userName}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-sm text-gray-900">
              <span className="font-semibold">{post.userName}</span>{" "}
              {post.caption}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-900"
                >
                  <span className="font-semibold">{comment.user}</span>{" "}
                  {comment.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Написати коментар..."
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2196F3]"
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-[#2196F3] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Надіслати
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}