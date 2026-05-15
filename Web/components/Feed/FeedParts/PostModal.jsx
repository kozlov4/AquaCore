"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { modalBackdrop, modalContent } from "./feedAnimations";

export function PostModal({ post, onClose, onOpenComments }) {
  if (!post) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/70"
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[85vh] w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid h-full grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative bg-black">
            <Image
              src={post.image}
              alt={post.userName}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
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
                  <p className="text-xs text-gray-400">{post.time}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{post.userName}</span>{" "}
                {post.caption}
              </p>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Коментарі
                </p>

                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-sm text-gray-900">
                      <span className="font-semibold">{comment.user}</span>{" "}
                      {comment.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => onOpenComments(post)}
                className="text-sm font-medium text-[#2196F3] transition hover:underline"
              >
                Відкрити коментарі
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}