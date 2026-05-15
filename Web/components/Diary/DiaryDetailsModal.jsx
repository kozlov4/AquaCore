"use client";

import Image from "next/image";
import { X, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DiaryDetailsModal({ entry, onClose, onEdit, onDelete }) {
  return (
    <AnimatePresence mode="wait">
      {entry && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              max-h-[92vh] w-[calc(100%-28px)]
              max-w-[620px] -translate-x-1/2 -translate-y-1/2
              overflow-hidden rounded-2xl bg-white
              shadow-[0_28px_85px_rgba(0,0,0,0.34)]
            "
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <span
                  className={`
                    rounded-md px-2 py-1 text-[10px] font-black uppercase
                    ${
                      entry.tagColor === "red"
                        ? "bg-red-50 text-red-500"
                        : entry.tagColor === "green"
                        ? "bg-green-50 text-green-600"
                        : entry.tagColor === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  {entry.tagLabel}
                </span>

                <p className="mt-2 text-xs text-slate-400">{entry.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(entry)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                  title="Редагувати"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(entry)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Видалити"
                >
                  <Trash2 size={17} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                  title="Закрити"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-72px)] overflow-y-auto p-5">
              <h2 className="text-2xl font-black text-slate-950">
                {entry.title}
              </h2>

              {entry.aquarium && (
                <p className="mt-1 text-sm font-semibold text-[#635BFF]">
                  Екосистема: {entry.aquarium}
                </p>
              )}

              {entry.imageUrl && (
                <div className="relative mt-5 h-[260px] overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={entry.imageUrl}
                    alt={entry.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-700">
                {entry.text}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}