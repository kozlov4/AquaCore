"use client";

import { useEffect, useState } from "react";

export function useExplorePostModal({ post, onClose }) {
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
      setLikedComments([]);
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
        : [...prev, commentId]
    );
  };

  return {
    commentText,
    setCommentText,
    comments,
    isLiked,
    setIsLiked,
    isSaved,
    setIsSaved,
    likedComments,
    handleAddComment,
    toggleCommentLike,
  };
}