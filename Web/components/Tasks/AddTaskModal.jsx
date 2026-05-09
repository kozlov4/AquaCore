"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const templates = ["💧 Підміна води", "⚙️ Обслуговування", "🧪 Тести", "🌿 Рослини"];

export function AddTaskModal({ onClose, onSave }) {
  const [aquarium, setAquarium] = useState("Головний Травник (60 Л)");
  const [title, setTitle] = useState("Підміна води 30%");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("2026-04-24");
  const [repeat, setRepeat] = useState("Щотижня");
  const [activeTemplate, setActiveTemplate] = useState("💧 Підміна води");

  const handleSave = () => {
    if (!title.trim()) return;

    onSave?.({
      title,
      description: note,
      aquarium,
      date,
      repeat,
      category: activeTemplate,
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
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed left-1/2 top-1/2 z-50 w-[430px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[26px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Нове завдання
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Для якої екосистеми?
            </label>

            <button className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-900 transition hover:border-[#635BFF]">
              {aquarium}
              <ChevronDown size={18} />
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-slate-700">
              Швидкі шаблони
            </p>

            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => {
                    setActiveTemplate(template);
                    if (template.includes("Підміна")) setTitle("Підміна води 30%");
                    if (template.includes("Обслуговування"))
                      setTitle("Обслуговування фільтра");
                    if (template.includes("Тести")) setTitle("Тест параметрів води");
                    if (template.includes("Рослини")) setTitle("Догляд за рослинами");
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                    activeTemplate === template
                      ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                      : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Що потрібно зробити?
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />

            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Додаткові нотатки (опціонально)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Дата виконання
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Повторювати
              </label>

              <button className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-900">
                {repeat}
                <ChevronDown size={18} />
              </button>
            </div>
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
            Зберегти завдання
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}