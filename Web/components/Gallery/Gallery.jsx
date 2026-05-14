"use client";

import { ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { GalleryFilters } from "./GalleryFilters";
import { GalleryCard } from "./GalleryCard";
import { UploadPhotoModal } from "./UploadPhotoModal";
import { GalleryPhotoModal } from "./GalleryPhotoModal";
import { useGallery } from "../../hooks/useGallery";

export function Gallery() {
  const gallery = useGallery();

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
              onClick={() => gallery.setIsUploadOpen(true)}
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

          <GalleryFilters
            aquariums={gallery.aquariums}
            selectedAquariumName={gallery.selectedAquariumName}
            setSelectedAquariumName={gallery.setSelectedAquariumName}
            selectedCategory={gallery.selectedCategory}
            setSelectedCategory={gallery.setSelectedCategory}
            sortOrder={gallery.sortOrder}
            setSortOrder={gallery.setSortOrder}
          />

          {gallery.galleryError && (
            <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
              {gallery.galleryError}
            </p>
          )}

          {gallery.isLoading && (
            <p className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500">
              Завантаження галереї...
            </p>
          )}

          {gallery.isPhotoLoading && (
            <p className="mt-4 rounded-2xl border border-[#635BFF]/10 bg-[#635BFF]/10 px-5 py-4 text-sm font-bold text-[#635BFF]">
              Завантаження фото...
            </p>
          )}

          {!gallery.isLoading && gallery.photos.length === 0 && (
            <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center">
              <p className="text-5xl">🖼️</p>
              <h3 className="mt-4 text-xl font-black text-slate-950">
                Фото ще немає
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Завантажте перше фото своєї екосистеми.
              </p>
            </div>
          )}

          <motion.section
            layout
            className="
              mt-6 grid auto-rows-[145px] grid-cols-1 gap-4
              sm:mt-8 sm:auto-rows-[155px] sm:grid-cols-2 sm:gap-5
              xl:grid-cols-4
            "
          >
            {gallery.photos.map((photo, index) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
                index={index}
                onOpen={() => gallery.openPhoto(photo)}
              />
            ))}
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {gallery.isUploadOpen && (
          <UploadPhotoModal
            aquariums={gallery.aquariums}
            onClose={() => gallery.setIsUploadOpen(false)}
            onSave={gallery.handleSavePhoto}
            isLoading={gallery.isUploading}
          />
        )}
      </AnimatePresence>

      <GalleryPhotoModal
        photo={gallery.selectedPhoto}
        onClose={gallery.closePhoto}
        onDelete={gallery.handleDeletePhoto}
        onUpdateCaption={gallery.handleUpdatePhotoCaption}
      />
    </div>
  );
}