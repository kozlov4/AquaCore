"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { Header } from "../Profile/Header";

const initialPosts = [
  {
    id: 1,
    userName: "denys_kukulenko",
    time: "5 г",
    avatar: "/images/Avatar.png",
    image: "/images/Car.jpg",
    likes: "241",
    caption: "В нас краса 😍🐠💙",
    comments: [
      { id: 1, user: "aqua_world", text: "Дуже красиво виглядає 🔥" },
      { id: 2, user: "reef_club", text: "Який об’єм акваріума?" },
    ],
  },
  {
    id: 2,
    userName: "hobby_reef",
    time: "3 г",
    avatar: "/images/Avatar.png",
    image: "/images/Car.jpg",
    likes: "6,718",
    caption:
      "Personally, for every video we upload to YouTube we create different versions of the final thumbnail.",
    comments: [
      { id: 1, user: "denys_kukulenko", text: "Looks great!" },
      { id: 2, user: "ocean_fish", text: "Very nice post 👏" },
    ],
  },
  {
    id: 3,
    userName: "discovery",
    time: "2 д",
    avatar: "/images/Avatar.png",
    image: "/images/Car.jpg",
    likes: "1,208",
    caption: "Підводний світ завжди зачаровує 🌊",
    comments: [
      { id: 1, user: "marine_life", text: "Нереально красиво 😍" },
      { id: 2, user: "fish_zone", text: "Це просто вау" },
    ],
  },
  {
    id: 4,
    userName: "denys_kukulenko",
    time: "5 г",
    avatar: "/images/Avatar.png",
    image: "/images/Car.jpg",
    likes: "241",
    caption: "В нас краса 😍🐠💙",
    comments: [
      { id: 1, user: "aqua_help", text: "Класний пост!" },
      { id: 2, user: "plant_aqua", text: "Дуже атмосферно" },
    ],
  },
  {
    id: 5,
    userName: "denys_kukulenko",
    time: "5 г",
    avatar: "/images/Avatar.png",
    image: "/images/Car.jpg",
    likes: "241",
    caption: "В нас краса 😍🐠💙",
    comments: [
      { id: 1, user: "shrimp_house", text: "Супер 🔥" },
      { id: 2, user: "reef_fan", text: "Дуже подобається" },
    ],
  },
];

const categories = [
  { id: 1, title: "Всі новини", icon: "🌐" },
  { id: 2, title: "Мої підписки", icon: "🪸" },
  { id: 3, title: "Допомога / Питання", icon: "🆘" },
  { id: 4, title: "Травники та Акваскейп", icon: "🌿" },
  { id: 5, title: "Креветки-чати", icon: "🦐" },
  { id: 6, title: "Обговорення рибок", icon: "🐠" },
  { id: 7, title: "Обладнання та DIY", icon: "🛠️" },
  { id: 8, title: "Цікаве та Корисне", icon: "🧠" },
  { id: 9, title: "Термінові запити", icon: "🚨" },
];

const recommendations = [
  {
    id: 1,
    name: "KJ Chouda",
    role: "Followers you",
    avatar: "/images/Avatar.png",
  },
  {
    id: 2,
    name: "Dugesh Nadhi",
    role: "Followers you",
    avatar: "/images/Avatar.png",
  },
  {
    id: 3,
    name: "Ocean Life",
    role: "New account",
    avatar: "/images/Avatar.png",
  },
];

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const postVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.32,
      ease: "easeOut",
    },
  }),
};

const iconMotion = {
  whileHover: { scale: 1.08, y: -1 },
  whileTap: { scale: 0.92 },
  transition: { type: "spring", stiffness: 320, damping: 20 },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.18 },
  },
};

function PostModal({ post, onClose, onOpenComments }) {
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

function CommentsModal({ post, onClose, onAddComment }) {
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

function PostCard({
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
              ? "text-orange-500 cursor-pointer"
              : "text-gray-800 hover:text-black cursor-pointer"
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

      {showRecommendations && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">
              Рекомендації для вас
            </p>
            <motion.button
              type="button"
              className="cursor-pointer text-xs font-semibold text-[#4F46E5]"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
            >
              Дивитися всі
            </motion.button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommendations.map((user, recIndex) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.26,
                  ease: "easeOut",
                  delay: recIndex * 0.06,
                }}
                whileHover={{ y: -3 }}
                className="min-w-[130px] rounded-2xl border border-gray-200 bg-white p-4 text-center"
              >
                <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="mt-3 line-clamp-1 text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">{user.role}</p>

                <motion.button
                  type="button"
                  className="mt-3 cursor-pointer rounded-md bg-[#4F46E5] px-4 py-2 text-xs font-medium text-white"
                  whileHover={{
                    y: -1,
                    boxShadow: "0px 10px 22px rgba(79,70,229,0.22)",
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  Підписатися
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}

function CategoriesBlock() {
  return (
    <motion.aside
      className="sticky top-24 w-[260px] self-start"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-500">Категорії</h3>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            type="button"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.24,
              ease: "easeOut",
              delay: index * 0.04,
            }}
            whileHover={{ x: 4, backgroundColor: "rgba(243,244,246,1)" }}
            whileTap={{ scale: 0.985 }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left"
          >
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              {category.icon}
            </motion.span>

            <div>
              <p className="text-sm font-medium text-gray-900">
                {category.title}
              </p>
              <p className="text-xs text-gray-400">+100</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.aside>
  );
}

export function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentPostId, setCommentPostId] = useState(null);

  const toggleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const openPostModal = (post) => {
    setSelectedPostId(post.id);
  };

  const closePostModal = () => {
    setSelectedPostId(null);
  };

  const openCommentsModal = (post) => {
    setCommentPostId(post.id);
  };

  const closeCommentsModal = () => {
    setCommentPostId(null);
  };

  const handleAddComment = (postId, text) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  user: "you",
                  text,
                },
              ],
            }
          : post
      )
    );
  };

  const selectedPost =
    posts.find((post) => post.id === selectedPostId) || null;
  const commentPost =
    posts.find((post) => post.id === commentPostId) || null;

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
                {posts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    showRecommendations={index === 1}
                    likedPosts={likedPosts}
                    toggleLike={toggleLike}
                    openPostModal={openPostModal}
                    openCommentsModal={openCommentsModal}
                    savedPosts={savedPosts}
                    toggleSave={toggleSave}
                  />
                ))}
              </div>
            </section>

            <CategoriesBlock />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={closePostModal}
            onOpenComments={(post) => {
              closePostModal();
              openCommentsModal(post);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {commentPost && (
          <CommentsModal
            post={commentPost}
            onClose={closeCommentsModal}
            onAddComment={handleAddComment}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}