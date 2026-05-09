"use client";

import { useState } from "react";
import { X, ChevronDown, Upload } from "lucide-react";
import { motion } from "framer-motion";

const tags = ["🌿 Рослини", "🩺 Хвороба", "🐠 Поведінка", "⚙️ Обладнання"];

export function AddDiaryEntryModal({ onClose, onSave }) {
  const [date, setDate] = useState("2026-04-24");
  const [aquarium, setAquarium] = useState("Головний Травник");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [activeTag, setActiveTag] = useState("🌿 Рослини");
  const [pinned, setPinned] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !text.trim()) return;

    onSave?.({
      date: "24 Квітня 2026",
      aquarium,
      title,
      text,
      tag: activeTag.replace(/[^\p{L}\s]/gu, "").trim().toLowerCase(),
      tagColor: activeTag.includes("Рослини")
        ? "green"
        : activeTag.includes("Хвороба")
        ? "red"
        : "gray",
      pinned,
    });

    onClose();
  };

  return (
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
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ duration: 0.22 }}
        className="
          fixed left-1/2 top-1/2 z-50
          w-[470px]
          -translate-x-1/2
          -translate-y-1/2
          overflow-hidden
          rounded-[24px]
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.32)]
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-xl font-black text-slate-950">
            Новий запис у щоденник
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-black text-slate-700">
                Дата
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-bold outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black text-slate-700">
                Екосистема
              </label>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-bold text-slate-900"
              >
                {aquarium}
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700">
              Короткий заголовок
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. Змінив режим освітлення"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-slate-700">
              Спостереження
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опишіть детально..."
              className="h-[90px] w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-black text-slate-700">
              Категорія
            </p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    activeTag === tag
                      ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                      : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-black text-slate-700">
              Фото
            </p>

            <button
              type="button"
              className="
                flex h-[95px] w-full flex-col items-center justify-center
                rounded-2xl border-2 border-dashed border-slate-300
                bg-slate-50 text-slate-500 transition
                hover:border-[#635BFF]
                hover:bg-[#635BFF]/5
              "
            >
              <div className="mb-1 rounded-full bg-white p-2 shadow-sm">
                <Upload size={18} />
              </div>

              <span className="text-xs font-bold">
                Завантажити фото
              </span>

              <span className="mt-0.5 text-[10px] text-slate-400">
                PNG, JPG
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 accent-[#635BFF]"
            />

            📌 Закріпити
          </label>

          <div className="flex items-center gap-4">
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
                boxShadow: "0 12px 24px rgba(99,91,255,0.28)",
              }}
              whileTap={{ scale: 0.96 }}
              className="
                rounded-xl bg-[#635BFF]
                px-5 py-2.5
                text-sm font-black text-white
                transition hover:bg-[#5147f5]
              "
            >
              Зберегти
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}