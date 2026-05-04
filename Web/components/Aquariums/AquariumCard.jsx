"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { Droplet, Pencil, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function AquariumCard({
  aquarium,
  index,
  onOpenWaterParams,
  onOpenTask,
  onOpenSettings,
}) {
  const router = useRouter();

  const openDetails = () => {
    router.push("/aquarium-details");
  };

  return (
    <motion.article
      onClick={openDetails}
      initial={{ opacity: 0, y: 34, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: "easeOut",
      }}
      whileHover={{
        y: -10,
        scale: 1.018,
      }}
      whileTap={{ scale: 0.985 }}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-[#5B4CF6]/20 hover:shadow-[0_28px_80px_rgba(15,23,42,0.16)]"
    >
      <div className="relative h-[180px] overflow-hidden">
        <Image
          src={aquarium.image}
          alt={aquarium.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        <motion.div
          whileHover={{ scale: 1.08 }}
          className="absolute right-3 top-3 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
        >
          {aquarium.volume}
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-950 transition group-hover:text-[#5B4CF6]">
          {aquarium.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.65)]" />
          Стан: {aquarium.status}
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "92%" }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
          />
        </div>

        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <p>➜ Населення: {aquarium.population}</p>
          <p>✓ {aquarium.lastTest}</p>
          <p>{aquarium.params}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-gray-100 bg-white/80 backdrop-blur">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenWaterParams();
          }}
          className="flex h-12 items-center justify-center text-gray-500 transition-all duration-300 hover:bg-[#5B4CF6]/10 hover:text-[#5B4CF6] active:scale-95"
          title="Запис параметрів води"
        >
          <Droplet size={17} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenTask();
          }}
          className="flex h-12 items-center justify-center text-gray-500 transition-all duration-300 hover:bg-[#5B4CF6]/10 hover:text-[#5B4CF6] active:scale-95"
          title="Нове завдання"
        >
          <Pencil size={17} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenSettings();
          }}
          className="flex h-12 items-center justify-center text-gray-500 transition-all duration-300 hover:bg-[#5B4CF6]/10 hover:text-[#5B4CF6] active:scale-95"
          title="Налаштування"
        >
          <Settings size={17} />
        </button>
      </div>
    </motion.article>
  );
}