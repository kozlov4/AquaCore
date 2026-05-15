"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { contentVariants } from "./explorePostAnimations";

export function ExplorePostImage({ post }) {
  return (
    <motion.div
      variants={contentVariants}
      className="relative hidden h-full flex-1 bg-black md:block"
    >
      <Image src={post.image} alt={post.alt} fill className="object-cover" />
    </motion.div>
  );
}