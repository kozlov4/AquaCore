"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function getTagStyle(tag) {
  const value = String(tag || "").toLowerCase();

  if (value.includes("хиж")) {
    return "bg-[#ffe8e8] text-[#e11d48]";
  }

  if (value.includes("мир")) {
    return "bg-[#e8f8ee] text-[#1f9d55]";
  }

  if (value.includes("слабке") || value.includes("світло")) {
    return "bg-[#fff5d7] text-[#c47a00]";
  }

  if (value.includes("co2")) {
    return "bg-[#f2f4f7] text-[#475467]";
  }

  if (value.includes("л")) {
    return "bg-[#eaf4ff] text-[#1785ff]";
  }

  return "bg-[#f2f4f7] text-[#475467]";
}

export function SpeciesCard({ item, index }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 14,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.035,
        duration: 0.25,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 16px 32px rgba(15,23,42,0.07)",
      }}
      className="
        overflow-hidden rounded-[14px] border border-[#edf0f5]
        bg-white p-[14px]
        shadow-[0_8px_24px_rgba(15,23,42,0.025)]
        transition-all duration-300
      "
    >
      <div className="relative flex h-[145px] items-center justify-center overflow-hidden rounded-[10px] bg-[#f8fafc]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : (
          <span className="text-[52px] leading-none">{item.icon || "🐟"}</span>
        )}

        <span
          className="
            absolute right-[8px] top-[8px]
            rounded-[5px] bg-white px-[8px] py-[4px]
            text-[8px] font-extrabold uppercase tracking-[0.04em]
            text-[#667085] shadow-sm
          "
        >
          {item.water || "Прісна"}
        </span>
      </div>

      <div className="pt-[13px]">
        <h3 className="line-clamp-1 text-[14px] font-extrabold leading-tight text-[#111827]">
          {item.name || "Без назви"}
        </h3>

        <p className="mt-[2px] line-clamp-1 text-[10px] italic leading-tight text-[#6b7280]">
          {item.latin || "—"}
        </p>

        <div className="mt-[11px] flex min-h-[24px] flex-wrap gap-[6px]">
          {(item.tags || []).slice(0, 3).map((tag) => (
            <span
              key={`${item.id}-${tag}`}
              className={`inline-flex h-[21px] items-center rounded-[5px] px-[7px] text-[10px] font-bold ${getTagStyle(
                tag,
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/species-details?id=${item.id}`}
          className="
    mt-[13px] flex h-[32px] items-center justify-center
    rounded-[7px] bg-[#fafafa]
    text-[12px] font-extrabold text-[#374151]
    transition-all duration-200
    hover:bg-[#f4f2ff] hover:text-[#635bff]
  "
        >
          Детальніше
        </Link>
      </div>
    </motion.article>
  );
}

export default SpeciesCard;
