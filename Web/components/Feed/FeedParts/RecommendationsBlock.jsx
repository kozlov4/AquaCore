"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { recommendations } from "../../../hooks/useFeed";

export function RecommendationsBlock() {
  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">
          Рекомендації для вас
        </p>

        <motion.button
          type="button"
          className="cursor-pointer text-xs font-semibold text-[#4F46E5]"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
        >
          Дивитися всі
        </motion.button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {recommendations.map((user, recIndex) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.26,
              ease: "easeOut",
              delay: recIndex * 0.06,
            }}
            whileHover={{ y: -3 }}
            className="min-w-[130px] rounded-2xl border border-gray-200 bg-white p-4 text-center"
          >
            <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>

            <p className="mt-3 line-clamp-1 text-sm font-semibold text-gray-900">
              {user.name}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">{user.role}</p>

            <motion.button
              type="button"
              className="mt-3 cursor-pointer rounded-md bg-[#4F46E5] px-4 py-2 text-xs font-medium text-white"
              whileHover={{
                y: -1,
                boxShadow: "0px 10px 22px rgba(79,70,229,0.22)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              Підписатися
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}