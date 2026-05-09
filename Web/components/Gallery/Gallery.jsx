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
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-10">
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Особиста Галерея
              </h1>

              <p className="mt-2 text-sm text-slate-500">
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
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              <ImagePlus size={17} />
              Завантажити фото
            </motion.button>
          </motion.header>

          <GalleryFilters />

          <motion.section
            layout
            className="mt-8 grid auto-rows-[155px] grid-cols-4 gap-5"
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