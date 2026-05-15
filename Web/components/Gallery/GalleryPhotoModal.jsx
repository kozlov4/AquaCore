"use client";

import Image from "next/image";
import { useState } from "react";
import { X, Trash2, Pencil, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GalleryPhotoModal({
  photo,
  onClose,
  onDelete,
  onUpdateCaption,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState("");

  const startEdit = () => {
    setCaption(photo?.caption || "");
    setIsEditing(true);
  };

  const saveEdit = async () => {
    await onUpdateCaption?.(photo.id, caption);
    setIsEditing(false);
  };

  return (
    <AnimatePresence mode="wait">
      {photo && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 22 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-[90]
              flex max-h-[92vh] w-[calc(100%-28px)]
              max-w-[1120px] -translate-x-1/2 -translate-y-1/2
              flex-col overflow-hidden rounded-2xl
              bg-[#101010] shadow-[0_35px_120px_rgba(0,0,0,0.45)]
              sm:w-[92vw]
            "
          >
            <div
              className="
                flex items-start justify-between gap-4
                bg-gradient-to-b from-black/90 to-[#101010]
                px-4 py-4
                sm:px-5
              "
            >
              <div className="min-w-0">
                <span
                  className="
                    inline-flex rounded-md bg-white/10
                    px-2 py-1 text-[10px] font-black uppercase
                    tracking-wide text-white
                  "
                >
                  {photo.aquarium || "Акваріум"}
                </span>

                {photo.date && (
                  <p className="mt-2 text-xs text-white/55">
                    Завантажено: {photo.date}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <motion.button
                  type="button"
                  onClick={() => onDelete?.(photo.id)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full bg-white/5 text-white/80
                    transition hover:bg-red-500 hover:text-white
                  "
                  title="Видалити"
                >
                  <Trash2 size={16} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full bg-white/5 text-white/80
                    transition hover:bg-white/15 hover:text-white
                  "
                  title="Закрити"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            <div
              className="
                relative flex min-h-[260px] flex-1 items-center justify-center
                bg-black
                sm:min-h-[420px]
                lg:min-h-[520px]
              "
            >
              {photo.image ? (
                <Image
                  src={photo.image}
                  alt={photo.title || "Фото екосистеми"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div
                  className={`
                    flex h-full min-h-[420px] w-full items-center justify-center
                    bg-gradient-to-br ${
                      photo.gradient || "from-[#635BFF] to-[#22D3EE]"
                    }
                    text-7xl
                  `}
                >
                  {photo.icon || "🖼️"}
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15" />
            </div>

            <div
              className="
                flex flex-col gap-4
                bg-gradient-to-t from-black/90 to-[#101010]
                px-4 py-5
                sm:px-5
              "
            >
              {isEditing ? (
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="
                    min-h-[90px] w-full resize-none rounded-2xl
                    border border-white/10 bg-white/10
                    px-4 py-3 text-sm leading-6 text-white
                    outline-none placeholder:text-white/40
                    focus:border-white/25
                  "
                  placeholder="Опис фото..."
                />
              ) : (
                <p className="max-w-[820px] text-sm font-medium leading-6 text-white">
                  {photo.caption || "Опис відсутній"}
                </p>
              )}

              <div className="flex justify-center">
                {isEditing ? (
                  <motion.button
                    type="button"
                    onClick={saveEdit}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-full bg-green-500 text-white
                      transition hover:bg-green-600
                    "
                    title="Зберегти опис"
                  >
                    <Check size={15} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={startEdit}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-full bg-white/10 text-white/80
                      transition hover:bg-white/20 hover:text-white
                    "
                    title="Редагувати опис"
                  >
                    <Pencil size={15} />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}