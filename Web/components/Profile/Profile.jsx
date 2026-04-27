"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ProfileModals } from "./ProfileModals";
import { useProfileModals } from "../../hooks/useProfileModals";

const stories = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: "Назва акваріуму",
  image: "/images/stories.jpg",
}));

const posts = [
  "/images/post1.jpg",
  "/images/post2.jpg",
  "/images/post3.jpg",
  "/images/post4.jpg",
  "/images/post5.jpg",
  "/images/post6.jpg",
  "/images/post7.jpg",
  "/images/post8.jpg",
  "/images/post9.jpg",
];

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
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
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const profileHeaderVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const storyItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.04,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

const postVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.18 + index * 0.03,
      duration: 0.32,
      ease: "easeOut",
    },
  }),
};

export function Profile() {
  const isOwnProfile = true;
  const profileModals = useProfileModals(isOwnProfile);

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
          <div className="mx-auto max-w-[980px]">
            <motion.header
              variants={profileHeaderVariants}
              className="mb-10 mt-4 flex items-start gap-12"
            >
              <div className="flex w-[290px] justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative h-40 w-40 overflow-hidden rounded-full border border-gray-200"
                >
                  <Image
                    src="/images/Avatar.png"
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>

              <div className="flex-1">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="text-[28px] font-normal text-gray-900"
                  >
                    mkbhd
                  </motion.h1>

                  {!isOwnProfile && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200"
                      >
                        Підписки
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200"
                      >
                        Повідомлення
                      </motion.button>
                    </>
                  )}

                  <div className="relative" ref={profileModals.menuRef}>
                    <motion.button
                      type="button"
                      onClick={profileModals.toggleMenu}
                      whileHover={{ scale: 1.08, rotate: 8 }}
                      whileTap={{ scale: 0.94 }}
                      className="cursor-pointer rounded-lg p-2 hover:bg-gray-100"
                    >
                      <MoreHorizontal size={20} />
                    </motion.button>

                    <AnimatePresence>
                      {!isOwnProfile && profileModals.isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-12 z-20 w-[200px] rounded-[22px] bg-white py-3 shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                        >
                          <motion.button
                            type="button"
                            onClick={profileModals.handleOpenReport}
                            whileHover={{ x: 4}}
                            className="block w-full cursor-pointer px-6 py-2 text-left text-md font-medium text-[#FF6B81]"
                          >
                            Звіт
                          </motion.button>

                          <motion.button
                            type="button"
                            onClick={profileModals.handleOpenUnfollow}
                            whileHover={{ x: 4}}
                            className="block w-full cursor-pointer px-6 py-2 text-left text-md font-medium text-[#FF6B81]"
                          >
                            Відписатися
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.div
                  variants={sectionVariants}
                  className="mb-5 flex gap-10 text-sm text-gray-900"
                >
                  <p>
                    <span className="font-semibold">1,861</span> posts
                  </p>
                  <p>
                    <span className="font-semibold">4M</span> followers
                  </p>
                  <p>
                    <span className="font-semibold">454</span> following
                  </p>
                </motion.div>

                <motion.div
                  variants={sectionVariants}
                  className="text-sm leading-6 text-gray-900"
                >
                  <p className="font-semibold">Marques Brownlee</p>
                  <p className="text-gray-700">
                    I promise I won&apos;t overdo the filters.
                  </p>
                </motion.div>
              </div>
            </motion.header>

            <motion.section
              variants={sectionVariants}
              className="mb-10 flex gap-6 overflow-x-auto pb-2"
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  custom={index}
                  variants={storyItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex min-w-[76px] cursor-pointer flex-col items-center text-center"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="mb-2"
                  >
                    <motion.div
                      className="rounded-full p-[3px]"
                      style={{
                        background:
                          "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 55%, #6228d7 100%)",
                      }}
                      whileHover={{
                        scale: 1.08,
                        boxShadow: "0px 12px 28px rgba(238,42,123,0.22)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 18,
                      }}
                    >
                      <div className="rounded-full bg-white p-[2px]">
                        <div className="relative h-[66px] w-[66px] overflow-hidden rounded-full">
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  <span className="line-clamp-1 text-[11px] text-gray-700">
                    {story.title}
                  </span>
                </motion.div>
              ))}
            </motion.section>

            <motion.div
              variants={sectionVariants}
              className="mb-5 border-t border-gray-200"
            />

            <motion.section
              variants={sectionVariants}
              className="grid grid-cols-3 gap-1 md:gap-2"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 0.985 }}
                  className="relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-full w-full"
                  >
                    <Image
                      src="/images/Car.jpg"
                      alt={`post-${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/10"
                  />
                </motion.div>
              ))}
            </motion.section>
          </div>
        </main>
      </div>

      <ProfileModals {...profileModals} />
    </motion.div>
  );
}
