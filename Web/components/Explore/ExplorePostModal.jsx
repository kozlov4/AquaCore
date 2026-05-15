"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useExplorePostModal } from "../../hooks/useExplorePostModal";
import {
  backdropVariants,
  modalVariants,
} from "./ExplorePostModalParts/explorePostAnimations";
import { ExplorePostImage } from "./ExplorePostModalParts/ExplorePostImage";
import { ExplorePostHeader } from "./ExplorePostModalParts/ExplorePostHeader";
import { ExplorePostComments } from "./ExplorePostModalParts/ExplorePostComments";
import { ExplorePostActions } from "./ExplorePostModalParts/ExplorePostActions";

export function ExplorePostModal({ post, onClose }) {
  const modal = useExplorePostModal({ post, onClose });

  if (!post) return null;

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
        <ExplorePostImage post={post} />

        <div className="flex h-full w-full flex-col md:w-[420px]">
          <ExplorePostHeader post={post} />

          <ExplorePostComments
            post={post}
            comments={modal.comments}
            likedComments={modal.likedComments}
            toggleCommentLike={modal.toggleCommentLike}
          />

          <ExplorePostActions
            post={post}
            isLiked={modal.isLiked}
            setIsLiked={modal.setIsLiked}
            isSaved={modal.isSaved}
            setIsSaved={modal.setIsSaved}
            commentText={modal.commentText}
            setCommentText={modal.setCommentText}
            handleAddComment={modal.handleAddComment}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}