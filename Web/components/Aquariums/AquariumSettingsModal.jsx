"use client";

import Image from "next/image";
import { X, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AquariumSettingsModal({
  isOpen,
  aquarium,
  onClose,
  onEdit,
  onDelete,
  onSave,
}) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(aquarium);
      return;
    }

    if (onSave) {
      onSave(aquarium);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && aquarium && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              w-[calc(100%-28px)] max-w-[460px]
              -translate-x-1/2 -translate-y-1/2
              overflow-hidden rounded-2xl bg-white
              shadow-[0_28px_85px_rgba(0,0,0,0.34)]
            "
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-black text-slate-950">
                Налаштування акваріума
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={21} />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="relative h-[180px] overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={aquarium.image || "/images/fish-card.jpg"}
                  alt={aquarium.name || "Aquarium"}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-950">
                {aquarium.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {aquarium.volume || "0 л"} •{" "}
                {aquarium.environment || aquarium.type || "Прісноводний"}
              </p>

              {aquarium.createdDate && (
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Запущено: {aquarium.createdDate}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="
                    flex items-center justify-center gap-2
                    rounded-xl bg-[#635BFF] px-5 py-3
                    text-sm font-black text-white
                    transition hover:bg-[#5147f5]
                  "
                >
                  <Pencil size={17} />
                  Редагувати акваріум
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(aquarium)}
                  className="
                    flex items-center justify-center gap-2
                    rounded-xl border border-red-100 bg-red-50
                    px-5 py-3 text-sm font-black text-red-500
                    transition hover:bg-red-100
                  "
                >
                  <Trash2 size={17} />
                  Видалити акваріум
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}