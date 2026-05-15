"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { Header } from "../Profile/Header";
import { useFeed } from "../../hooks/useFeed";
import { pageVariants, sectionVariants } from "./FeedParts/feedAnimations";
import { PostCard } from "./FeedParts/PostCard";
import { PostModal } from "./FeedParts/PostModal";
import { CommentsModal } from "./FeedParts/CommentsModal";
import { CategoriesBlock } from "./FeedParts/CategoriesBlock";

export function Feed() {
  const feed = useFeed();

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

        <main className="px-8 py-6">
          <motion.div
            className="mx-auto flex max-w-[1200px] gap-12"
            variants={sectionVariants}
          >
            <section className="flex-1">
              <div className="mx-auto max-w-[470px]">
                {feed.posts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    showRecommendations={index === 1}
                    likedPosts={feed.likedPosts}
                    toggleLike={feed.toggleLike}
                    openPostModal={feed.openPostModal}
                    openCommentsModal={feed.openCommentsModal}
                    savedPosts={feed.savedPosts}
                    toggleSave={feed.toggleSave}
                  />
                ))}
              </div>
            </section>

            <CategoriesBlock />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {feed.selectedPost && (
          <PostModal
            post={feed.selectedPost}
            onClose={feed.closePostModal}
            onOpenComments={(post) => {
              feed.closePostModal();
              feed.openCommentsModal(post);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feed.commentPost && (
          <CommentsModal
            post={feed.commentPost}
            onClose={feed.closeCommentsModal}
            onAddComment={feed.handleAddComment}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}