"use client";

import { motion } from "framer-motion";

const actions = [
  { icon: "💧", title: "Зафіксувати підміну", bg: "bg-blue-50" },
  { icon: "🧪", title: "Записати тести води", bg: "bg-emerald-50" },
  { icon: "📝", title: "Нотатка в журналі", bg: "bg-slate-100" },
  { icon: "✅", title: "Нове завдання", bg: "bg-green-50" },
  { icon: "📸", title: "Завантажити фото", bg: "bg-slate-100" },
];

export function QuickActionMenu({ onClose }) {
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
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        transition={{ duration: 0.24 }}
        className="fixed left-[140px] top-[88px] z-50 w-[310px] overflow-hidden rounded-[26px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">
            Що робимо?
          </h2>
        </div>

        <div className="p-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              type="button"
              onClick={onClose}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ x: 5, backgroundColor: "#F8FAFC" }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${action.bg}`}
              >
                {action.icon}
              </span>

              <span className="text-lg font-black text-slate-700">
                {action.title}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}