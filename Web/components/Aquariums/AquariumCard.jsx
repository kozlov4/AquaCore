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
    router.push(`/aquarium-details?id=${aquarium.id}`);
  };

  return (
    <motion.article
      layout
      onClick={openDetails}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: "0 24px 60px rgba(15,23,42,0.14)",
      }}
      whileTap={{ scale: 0.98 }}
      className="
        group cursor-pointer overflow-hidden rounded-3xl
        border border-slate-100 bg-white
        shadow-sm transition-all duration-300
      "
    >
      <div className="relative h-[180px] bg-slate-100">
        <Image
          src={aquarium.image || "/images/fish-card.jpg"}
          alt={aquarium.name || "Aquarium"}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#635BFF] shadow-sm">
          {aquarium.volume || "0 л"}
        </span>

        <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {aquarium.environment || aquarium.type || "Прісноводний"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              {aquarium.name}
            </h3>

            <p className="mt-1 text-sm font-semibold text-emerald-600">
              Стан: {aquarium.status || "Активний"}
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenSettings?.();
            }}
            className="
              rounded-xl p-2 text-slate-400 transition
              hover:bg-slate-100 hover:text-slate-950
            "
            title="Налаштування"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-500">
          <p>➜ Населення: {aquarium.population || "Жителів ще немає"}</p>
          <p>✓ {aquarium.lastTest || "Тестів ще немає"}</p>
          <p className="font-bold text-slate-700">
            {aquarium.params || "pH — · GH — · KH —"}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenWaterParams?.();
            }}
            className="
              flex h-12 items-center justify-center gap-2
              text-sm font-bold text-gray-500
              transition-all duration-300
              hover:bg-[#5B4CF6]/10 hover:text-[#5B4CF6]
              active:scale-95
            "
          >
            <Droplet size={17} />
            Вода
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenTask?.();
            }}
            className="
              flex h-12 items-center justify-center gap-2
              border-l border-slate-100
              text-sm font-bold text-gray-500
              transition-all duration-300
              hover:bg-[#5B4CF6]/10 hover:text-[#5B4CF6]
              active:scale-95
            "
          >
            <Pencil size={17} />
            Завдання
          </button>
        </div>
      </div>
    </motion.article>
  );
}