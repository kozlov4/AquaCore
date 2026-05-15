"use client";

import { motion } from "framer-motion";

const colorMap = {
  blue: {
    dot: "bg-blue-500",
    border: "border-slate-100",
    bg: "bg-white",
    text: "text-slate-950",
  },
  violet: {
    dot: "bg-[#635BFF]",
    border: "border-slate-100",
    bg: "bg-white",
    text: "text-slate-950",
  },
  red: {
    dot: "bg-red-500",
    border: "border-red-100",
    bg: "bg-red-50/30",
    text: "text-red-600",
  },
  gray: {
    dot: "bg-slate-400",
    border: "border-slate-100",
    bg: "bg-white",
    text: "text-slate-950",
  },
  yellow: {
    dot: "bg-yellow-400",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
};

export function TimelineEventCard({ event, index }) {
  const style = colorMap[event.color];

  return (
    <motion.article
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="relative pl-16"
    >
      <div
        className={`absolute left-[17px] top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full ${style.dot} text-[10px] text-white ring-4 ring-white`}
      >
        {event.icon}
      </div>

      <div
        className={`rounded-2xl border ${style.border} ${style.bg} p-5 shadow-sm transition hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]`}
      >
        <div className="mb-2 flex items-start justify-between">
          <h3 className={`text-base font-black ${style.text}`}>
            {event.title}
          </h3>

          <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-400">
            {event.date}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-500">{event.text}</p>

        {event.subtext && (
          <p className="mt-1 text-xs italic text-slate-400">{event.subtext}</p>
        )}

        {event.data && (
          <div className="mt-4 flex gap-2">
            {event.data.map((item) => (
              <span
                key={item}
                className="rounded-md bg-green-50 px-2 py-1 text-xs font-black text-green-600"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}