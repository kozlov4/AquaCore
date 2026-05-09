"use client";

import { useState } from "react";
import { X, ChevronDown, Upload } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["🖼️ Загальний план", "🐟 Жителі", "🌿 Рослини", "⚙️ Інше"];

export function UploadPhotoModal({ onClose, onSave }) {
  const [aquarium, setAquarium] = useState("Головний Травник (60 Л)");
  const [category, setCategory] = useState("🖼️ Загальний план");
  const [caption, setCaption] = useState("");

  const handleSave = () => {
    onSave?.({
      aquarium,
      category,
      caption,
    });

    onClose();
  };

  return (
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
        className="fixed left-1/2 top-1/2 z-50 w-[460px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-[0_28px_85px_rgba(0,0,0,0.34)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Завантажити фотографію
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={21} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <button
            type="button"
            className="flex h-[165px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-slate-50 text-center transition hover:border-[#635BFF] hover:bg-[#635BFF]/5"
          >
            <div className="mb-4 rounded-full bg-white p-4 text-[#635BFF] shadow-sm">
              <Upload size={24} />
            </div>

            <p className="text-sm font-black text-[#2F2A8F]">
              Натисніть для вибору файлу
            </p>

            <p className="mt-1 text-xs text-slate-400">
              або перетягніть фотографію сюди &#40;до 10 MB&#41;
            </p>
          </button>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Для якої екосистеми?
            </label>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-[#635BFF]/40"
            >
              {aquarium}
              <ChevronDown size={18} className="text-slate-400" />
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-slate-700">
              Що на фото? &#40;Категорія&#41;
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                    category === item
                      ? "border-[#635BFF] bg-[#635BFF] text-white shadow-[0_10px_24px_rgba(99,91,255,0.25)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#635BFF]/40 hover:text-[#635BFF]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Підпис &#40;Опціонально&#41;
            </label>

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Наприклад: Вигляд після прополки..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 bg-slate-50 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-black text-slate-600 transition hover:text-slate-950"
          >
            Скасувати
          </button>

          <motion.button
            type="button"
            onClick={handleSave}
            whileHover={{
              y: -2,
              boxShadow: "0 14px 28px rgba(99,91,255,0.32)",
            }}
            whileTap={{ scale: 0.96 }}
            className="rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
          >
            Зберегти в галерею
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}