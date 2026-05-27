"use client";

import { motion } from "framer-motion";

function isAggressiveCharacter(character, name, latin) {
  const value = `${character || ""} ${name || ""} ${latin || ""}`.toLowerCase();

  return (
    value.includes("агрес") ||
    value.includes("aggressive") ||
    value.includes("territorial") ||
    value.includes("територ") ||
    value.includes("хиж") ||
    value.includes("predator") ||
    value.includes("астронотус") ||
    value.includes("оскар") ||
    value.includes("astronotus")
  );
}

export function Resident({
  name,
  latin,
  count,
  icon,
  settlementDate,
  character,
}) {
  const isAggressive = isAggressiveCharacter(character, name, latin);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${
        isAggressive
          ? "border-red-100 bg-red-50/70"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
            isAggressive ? "bg-red-100" : "bg-[#eef2ff]"
          }`}
        >
          {icon || "🐠"}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-gray-900">{name}</h3>

            {isAggressive && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-black text-red-700">
                Небезпечно
              </span>
            )}
          </div>

          {latin && (
            <p className="mt-0.5 text-sm font-semibold text-gray-500">
              {latin}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {settlementDate && (
              <p className="text-xs font-bold text-gray-400">
                Заселено: {settlementDate}
              </p>
            )}

            {character && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-black ${
                  isAggressive
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {character}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl px-4 py-2 text-sm font-black ${
          isAggressive
            ? "bg-red-100 text-red-700"
            : "bg-gray-50 text-gray-700"
        }`}
      >
        {count}
      </div>
    </motion.div>
  );
}

export default Resident;