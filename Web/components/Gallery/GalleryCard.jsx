"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function GalleryCard({ photo, index, onOpen }) {
  const sizeClass = {
    large: "sm:row-span-2",
    tall: "sm:row-span-2",
    wide: "",
    medium: "",
  };

  return (
    <motion.article
      layout
      onClick={onOpen}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: "0 24px 60px rgba(15,23,42,0.14)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative min-h-[145px] cursor-pointer overflow-hidden
        rounded-2xl bg-gradient-to-br
        ${photo.gradient || "from-[#635BFF] to-[#22D3EE]"}
        ${sizeClass[photo.size] || ""}
        sm:min-h-0
      `}
    >
      {photo.image ? (
        <Image
          src={photo.image}
          alt={photo.title || "Фото екосистеми"}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      ) : (
        <motion.div
          whileHover={{ scale: 1.22, rotate: 8 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="
            absolute inset-0 flex items-center justify-center
            text-5xl drop-shadow-md
            sm:text-6xl
          "
        >
          {photo.icon || "🖼️"}
        </motion.div>
      )}

      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />

      <div
        className="
          absolute inset-x-0 bottom-0
          translate-y-0 bg-gradient-to-t from-black/55 to-transparent
          p-4 transition duration-300
          sm:translate-y-full sm:group-hover:translate-y-0
        "
      >
        <p className="text-sm font-black text-white">
          {photo.title || "Фото екосистеми"}
        </p>
        <p className="text-xs text-white/75">
          {photo.aquarium || "Акваріум"}
        </p>
      </div>
    </motion.article>
  );
}