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
      initial={{
        opacity: 0,
        y: 16,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 18px 36px rgba(15,23,42,0.08)",
      }}
      whileTap={{
        scale: 0.985,
      }}
      className="
        group flex min-h-[390px] cursor-pointer flex-col overflow-hidden
        rounded-[14px] border border-[#edf0f4] bg-white
        shadow-[0_8px_24px_rgba(15,23,42,0.04)]
        transition-all duration-300
      "
    >
      <div className="relative h-[185px] overflow-hidden bg-[#eaf1fb]">
        <Image
          src={aquarium.image || "/images/fish-card.jpg"}
          alt={aquarium.name || "Aquarium"}
          fill
          priority={index < 3}
          sizes="(max-width: 768px) 100vw, 320px"
          className="
            object-cover transition-transform duration-700
            group-hover:scale-[1.04]
          "
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

        <span
          className="
            absolute right-[14px] top-[12px]
            rounded-full bg-[#507da1]/95 px-[11px] py-[4px]
            text-[10px] font-semibold text-white
            shadow-[0_7px_15px_rgba(15,23,42,0.14)]
            backdrop-blur-md
          "
        >
          {aquarium.volume || "0 л"}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-[18px] pt-[15px]">
        <h3 className="mb-[13px] text-[16px] font-extrabold leading-tight text-[#111827]">
          {aquarium.name || "Без назви"}
        </h3>

        <div className="space-y-[9px] text-[11px] leading-[1.45] text-[#6b7280]">
          <div className="flex items-start gap-[8px]">
            <span className="mt-[4px] text-[10px] leading-none text-[#3b82f6]">
              ◆
            </span>

            <p className="m-0">
              <span className="font-semibold text-[#374151]">Населення:</span>{" "}
              {aquarium.population || "Жителів ще немає"}
            </p>
          </div>

          <div className="flex items-start gap-[8px]">
            <span className="mt-[2px] text-[12px] font-bold leading-none text-[#22c55e]">
              ✓
            </span>

            <div>
              <p className="m-0">
                <span className="font-semibold text-[#374151]">
                  Останній тест
                </span>{" "}
                {aquarium.lastTest || "Тестів ще немає"}
              </p>

              <p className="m-0 mt-[1px] font-semibold text-[#6b7280]">
                {aquarium.params || "pH — · GH — · KH —"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto h-[42px]" />
      </div>

      <div className="mt-auto grid h-[52px] grid-cols-3 border-t border-[#edf0f4] bg-white">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenWaterParams?.();
          }}
          title="Параметри води"
          className="
            flex items-center justify-center text-[#64748b]
            transition-all duration-300
            hover:bg-[#f4f2ff] hover:text-[#635bff]
            active:scale-95
          "
        >
          <Droplet size={16} strokeWidth={1.7} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenTask?.();
          }}
          title="Додати завдання"
          className="
            flex items-center justify-center border-x border-[#edf0f4]
            text-[#64748b] transition-all duration-300
            hover:bg-[#f4f2ff] hover:text-[#635bff]
            active:scale-95
          "
        >
          <Pencil size={16} strokeWidth={1.7} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenSettings?.();
          }}
          title="Налаштування"
          className="
            flex items-center justify-center text-[#64748b]
            transition-all duration-300
            hover:bg-[#f4f2ff] hover:text-[#635bff]
            active:scale-95
          "
        >
          <Settings size={16} strokeWidth={1.7} />
        </button>
      </div>
    </motion.article>
  );
}