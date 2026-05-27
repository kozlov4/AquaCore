"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function getAquariumImage(aquarium) {
  return (
    aquarium?.image ||
    aquarium?.image_url ||
    aquarium?.cover_image_url ||
    aquarium?.avatar_url ||
    aquarium?.raw?.image_url ||
    aquarium?.raw?.cover_image_url ||
    aquarium?.raw?.avatar_url ||
    aquarium?.raw?.image?.url ||
    aquarium?.raw?.image?.image_url ||
    "/images/fish-card.jpg"
  );
}

function getAquariumName(aquarium) {
  return aquarium?.name || aquarium?.raw?.name || "Акваріум";
}

function getAquariumType(aquarium) {
  return (
    aquarium?.type ||
    aquarium?.environment ||
    aquarium?.raw?.type ||
    aquarium?.raw?.environment ||
    "Прісноводний"
  );
}

function getAquariumVolume(aquarium) {
  const volume =
    aquarium?.volumeValue ??
    aquarium?.volume ??
    aquarium?.raw?.volume ??
    aquarium?.raw?.liters ??
    0;

  if (typeof volume === "string" && volume.includes("л")) {
    return volume;
  }

  return `${volume} л`;
}

function getCreatedRawValue(aquarium) {
  return (
    aquarium?.created_at ||
    aquarium?.createdAt ||
    aquarium?.launch_date ||
    aquarium?.launchDate ||
    aquarium?.started_at ||
    aquarium?.startedAt ||
    aquarium?.start_date ||
    aquarium?.startDate ||
    aquarium?.setup_date ||
    aquarium?.setupDate ||
    aquarium?.raw?.created_at ||
    aquarium?.raw?.createdAt ||
    aquarium?.raw?.launch_date ||
    aquarium?.raw?.launchDate ||
    aquarium?.raw?.started_at ||
    aquarium?.raw?.startedAt ||
    aquarium?.raw?.start_date ||
    aquarium?.raw?.startDate ||
    aquarium?.raw?.setup_date ||
    aquarium?.raw?.setupDate ||
    aquarium?.raw?.date ||
    ""
  );
}

function formatCreatedDate(value) {
  if (!value) {
    return "не вказано";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return String(value);
  }
}

function getCreatedDate(aquarium) {
  return formatCreatedDate(getCreatedRawValue(aquarium));
}

function getStatusText(aquarium) {
  return aquarium?.status || aquarium?.raw?.status || "Активний";
}

export function AquariumHero({ aquarium, isLoading = false }) {
  const image = getAquariumImage(aquarium);
  const name = getAquariumName(aquarium);
  const type = getAquariumType(aquarium);
  const volume = getAquariumVolume(aquarium);
  const createdDate = getCreatedDate(aquarium);
  const status = getStatusText(aquarium);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative h-[220px] overflow-hidden rounded-3xl bg-slate-200 shadow-[0_22px_70px_rgba(15,23,42,0.18)]"
    >
      <Image
        src={image}
        alt={name}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1100px"
        className="object-cover transition duration-700 hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

     

      <div className="absolute bottom-6 left-6 text-white">
        <h1 className="text-3xl font-bold">
          {isLoading ? "Завантаження..." : name}
        </h1>

        <p className="mt-2 text-sm text-white/80">
          {type} • {volume}
        </p>
      </div>
    </motion.section>
  );
}

export default AquariumHero;