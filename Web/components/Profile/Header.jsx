"use client";

import { useEffect, useRef, useState } from "react";
import { CreatePostModal } from "../CreatePost/CreatePostModal";
import Link from "next/link";
import {
  House,
  Search,
  Compass,
  MessageCircle,
  Heart,
  SquarePlus,
  X,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const recentSearches = [
  {
    id: 1,
    name: "mkbhd",
    subtitle: "Marques Brownlee",
    avatar: "/images/Avatar.png",
  },
  {
    id: 2,
    name: "veritasium",
    subtitle: "Science channel",
    avatar: "/images/Avatar.png",
  },
];

const notifications = [
  {
    id: 1,
    user: "john383",
    action: "поставив лайк вашому посту",
    avatar: "/images/Avatar.png",
    postImage: "/images/Car.jpg",
  },
  {
    id: 2,
    user: "john383",
    action: "поставив лайк вашому коментарю",
    avatar: "/images/Avatar.png",
    postImage: "/images/Car.jpg",
  },
  {
    id: 3,
    user: "john383",
    action: "поставив лайк вашому посту",
    avatar: "/images/Avatar.png",
    postImage: "/images/Car.jpg",
  },
];

const headerItems = [
  { label: "Дім", href: "/feed", icon: House, type: "link" },
  { label: "Пошук", href: "#", icon: Search, type: "search" },
  { label: "Дослідити", href: "/explore", icon: Compass, type: "link" },
  { label: "Повідомлення", href: "/messages", icon: MessageCircle, type: "link" },
  { label: "Сповіщення", href: "#", icon: Heart, type: "notifications" },
  { label: "Створити пост", href: "#", icon: SquarePlus, type: "create" },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchHistory, setSearchHistory] = useState(recentSearches);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllHistory = () => setSearchHistory([]);
  const removeHistoryItem = (id) =>
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[66px] max-w-[1200px] items-center justify-center gap-10 px-6">
        {headerItems.map(({ label, href, icon: Icon, type }) => {
          // 🔍 SEARCH
          if (type === "search") {
            return (
              <div key={label} className="relative" ref={searchRef}>
                <button
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                >
                  <Icon size={18} />
                  {label}
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 top-12 z-50 w-[300px] -translate-x-1/2 rounded-2xl border bg-white p-3 shadow-lg"
                    >
                      <h3 className="mb-3 text-lg font-semibold">Пошук</h3>

                      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                        <Search size={16} />
                        <input
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="flex-1 bg-transparent outline-none"
                        />
                        <button onClick={() => setSearchValue("")}>
                          <X size={14} />
                        </button>
                      </div>

                      <div className="my-3 border-t" />

                      <div className="flex justify-between text-sm">
                        <span>Останні</span>
                        <button onClick={clearAllHistory}>Очистити</button>
                      </div>

                      <div className="mt-3 space-y-3">
                        {searchHistory.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div className="flex gap-2">
                              <Image
                                src={item.avatar}
                                alt=""
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div>
                                <p className="text-sm font-semibold">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <button onClick={() => removeHistoryItem(item.id)}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 🔔 NOTIFICATIONS
          if (type === "notifications") {
            return (
              <button
                key={label}
                onClick={() =>
                  setIsNotificationsOpen((prev) => !prev)
                }
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <Icon size={18} />
                {label}
              </button>
            );
          }

          // ➕ CREATE POST
          if (type === "create") {
            return (
              <button
                key={label}
                onClick={() => setIsCreatePostOpen(true)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <Icon size={18} />
                {label}
              </button>
            );
          }

          // 🔗 LINKS
          return (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* 🔔 NOTIFICATIONS PANEL */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsNotificationsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed right-6 top-20 z-50 w-[360px] rounded-2xl bg-white p-5 shadow-2xl"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: 100 }}
            >
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="mb-4 flex justify-between items-center"
                >
                  <div className="flex gap-3">
                    <Image
                      src={n.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p className="text-sm">
                      <b>{n.user}</b> {n.action}
                    </p>
                  </div>

                  <Image
                    src={n.postImage}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ➕ CREATE POST */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </header>
  );
}