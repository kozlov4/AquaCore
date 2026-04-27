"use client";

import Image from "next/image";

export function ExploreCard({ post, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative h-full w-full overflow-hidden bg-gray-100 text-left cursor-pointer"
    >
      <Image
        src={post.image}
        alt={post.alt}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
    </button>
  );
}