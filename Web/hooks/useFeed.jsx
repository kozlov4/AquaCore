"use client";

import { useState } from "react";

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

export const categories = [
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

export const recommendations = [
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

export function useFeed() {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentPostId, setCommentPostId] = useState(null);

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;
  const commentPost = posts.find((post) => post.id === commentPostId) || null;

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

  return {
    posts,
    likedPosts,
    savedPosts,
    selectedPost,
    commentPost,
    toggleLike,
    toggleSave,
    openPostModal,
    closePostModal,
    openCommentsModal,
    closeCommentsModal,
    handleAddComment,
  };
}