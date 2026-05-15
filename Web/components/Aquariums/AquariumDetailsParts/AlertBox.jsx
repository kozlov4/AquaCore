"use client";

import { motion } from "framer-motion";

export function AlertBox({ type, title, text, button }) {
  const isDanger = type === "danger";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex items-center justify-between rounded-2xl border p-5 transition ${
        isDanger
          ? "border-red-200 bg-red-50"
          : "border-orange-200 bg-orange-50"
      }`}
    >
      <div>
        <h3
          className={
            isDanger ? "font-bold text-red-700" : "font-bold text-orange-700"
          }
        >
          {isDanger ? "🚨" : "🐠"} {title}
        </h3>

        <p
          className={
            isDanger
              ? "mt-1 text-sm text-red-600"
              : "mt-1 text-sm text-orange-600"
          }
        >
          {text}
        </p>
      </div>

      <button
        className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition active:scale-95 ${
          isDanger
            ? "bg-red-500 hover:bg-red-600"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {button}
      </button>
    </motion.div>
  );
}