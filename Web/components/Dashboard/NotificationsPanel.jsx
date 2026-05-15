"use client";

import { motion } from "framer-motion";

const notifications = [
  {
    icon: "⚠️",
    title: "Пропущена підміна води!",
    text: 'Ви пропустили планову підміну в акваріумі "Головний Травник". Заплановано на вчора.',
    time: "2 години тому",
    danger: true,
  },
  {
    icon: "🌀",
    title: "Обслуговування фільтра",
    text: "Завтра час промивати фільтр Tetra EX 800 Plus.",
    time: "Сьогодні, 09:00",
    danger: false,
  },
  {
    icon: "🎉",
    title: "Вітаємо в Aquacore!",
    text: "Ваш профіль успішно створено. Додайте свій перший акваріум, щоб розпочати.",
    time: "12 Квітня",
    danger: false,
    muted: true,
  },
];

export function NotificationsPanel({ onClose }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.aside
        initial={{ opacity: 0, x: 40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.96 }}
        transition={{ duration: 0.24 }}
        className="fixed right-10 top-20 z-50 w-[430px] overflow-hidden rounded-[28px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
      >
        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">Сповіщення</h2>

          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
            2 нові
          </span>

          <button className="ml-auto text-sm font-black text-[#635BFF] hover:text-[#5147f5]">
            Позначити всі як прочитані
          </button>
        </div>

        <div>
          {notifications.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex gap-5 border-b border-slate-100 px-6 py-6 last:border-b-0 ${
                item.muted ? "opacity-60" : ""
              }`}
            >
              {!item.muted && (
                <div className="absolute left-0 top-0 h-full w-1 bg-[#635BFF]" />
              )}

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${
                  item.danger ? "bg-red-100" : "bg-blue-50"
                }`}
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-1 text-base leading-6 text-slate-500">
                  {item.text}
                </p>

                <p className="mt-3 text-sm font-black uppercase text-[#635BFF]">
                  {item.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-slate-50 px-6 py-5 text-base font-black text-slate-600 transition hover:bg-slate-100 hover:text-[#635BFF]"
        >
          Переглянути всю історію
        </button>
      </motion.aside>
    </>
  );
}