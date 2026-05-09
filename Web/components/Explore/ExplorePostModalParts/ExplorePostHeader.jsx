"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { contentVariants, iconMotion } from "./explorePostAnimations";

export function ExplorePostHeader({ post }) {
  return (
    <motion.div
      variants={contentVariants}
      className="flex items-center justify-between border-b border-gray-200 px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image src={post.avatar} alt={post.userName} fill className="object-cover" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">{post.userName}</p>
          <p className="text-xs text-gray-400">{post.location}</p>
        </div>
      </div>

      <motion.button
        type="button"
        className="text-gray-600 hover:text-black"
        {...iconMotion}
      >
        <MoreHorizontal size={18} />
      </motion.button>
    </motion.div>
  );
}