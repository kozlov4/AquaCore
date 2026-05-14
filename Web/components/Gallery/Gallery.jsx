"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { GalleryFilters } from "./GalleryFilters";
import { GalleryCard } from "./GalleryCard";
import { UploadPhotoModal } from "./UploadPhotoModal";

const initialPhotos = [
  {
    id: 1,
    icon: "🌿",
    size: "large",
    gradient: "from-[#A5A6FF] to-[#B883F2]",
  },
  {
    id: 2,
    icon: "🐟",
    size: "wide",
    gradient: "from-[#5BA9F8] to-[#56DDE2]",
  },
  {
    id: 3,
    icon: "⚙️",
    size: "tall",
    gradient: "from-[#2F3948] to-[#111827]",
  },
  {
    id: 4,
    icon: "🐌",
    size: "wide",
    gradient: "from-[#FFE17A] to-[#FF9A3D]",
  },
  {
    id: 5,
    icon: "🦐",
    size: "medium",
    gradient: "from-[#67E8A4] to-[#14B8A6]",
  },
];

export function Gallery() {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleSavePhoto = (photo) => {
    setPhotos((prev) => [
      {
        id: Date.now(),
        icon: photo.category.includes("Рослини")
          ? "🌿"
          : photo.category.includes("Жителі")
          ? "🐟"
          : photo.category.includes("Інше")
          ? "⚙️"
          : "🖼️",
        size: "wide",
        gradient: "from-[#635BFF] to-[#22D3EE]",
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Sidebar />

      <main
        className="
          px-4 pb-28 pt-6
          sm:px-6 sm:pb-32 sm:pt-8
          lg:ml-[88px] lg:px-16 lg:py-10
        "
      >
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
              mb-6 flex flex-col gap-5
              sm:mb-8
              md:flex-row md:items-start md:justify-between
            "
          >
            <div>
              <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Особиста Галерея
              </h1>

              <p className="mt-2 max-w-[520px] text-sm leading-6 text-slate-500">
                Візуальна історія еволюції ваших екосистем
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              whileHover={{
                y: -2,
                boxShadow: "0 16px 34px rgba(99,91,255,0.32)",
              }}
              whileTap={{ scale: 0.96 }}
              className="
                flex w-full items-center justify-center gap-2
                rounded-xl bg-[#635BFF] px-5 py-3
                text-sm font-black text-white
                transition hover:bg-[#5147f5]
                sm:w-fit sm:px-6
              "
            >
              <ImagePlus size={17} />
              Завантажити фото
            </motion.button>
          </motion.header>

          <GalleryFilters />

          <motion.section
            layout
            className="
              mt-6 grid auto-rows-[145px] grid-cols-1 gap-4
              sm:mt-8 sm:auto-rows-[155px] sm:grid-cols-2 sm:gap-5
              xl:grid-cols-4
            "
          >
            {photos.map((photo, index) => (
              <GalleryCard key={photo.id} photo={photo} index={index} />
            ))}
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {isUploadOpen && (
          <UploadPhotoModal
            onClose={() => setIsUploadOpen(false)}
            onSave={handleSavePhoto}
          />
        )}
      </AnimatePresence>
    </div>
  );
}