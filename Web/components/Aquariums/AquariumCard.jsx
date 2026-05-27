"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { Droplet, Pencil, Settings } from "lucide-react";
import { motion } from "framer-motion";

function getAquariumImage(aquarium) {
  return (
    aquarium.image ||
    aquarium.image_url ||
    aquarium.cover_image_url ||
    "/images/fish-card.jpg"
  );
}

function getAquariumVolume(aquarium) {
  const volume = aquarium.volume;

  if (volume === null || volume === undefined || volume === "") {
    return "0 л";
  }

  if (typeof volume === "string" && volume.includes("л")) {
    return volume;
  }

  return `${volume} л`;
}

function getPopulationText(aquarium) {
  const population = aquarium.population;

  if (!population) {
    return "Жителів ще немає";
  }

  if (typeof population === "string") {
    return population;
  }

  if (typeof population === "object") {
    const totalQuantity =
      population.total_quantity ??
      population.total_count ??
      population.count ??
      0;

    const speciesNames = Array.isArray(population.species_names)
      ? population.species_names
      : [];

    if (totalQuantity > 0 && speciesNames.length > 0) {
      return `${totalQuantity} особин: ${speciesNames.join(", ")}`;
    }

    if (totalQuantity > 0) {
      return `${totalQuantity} жителів`;
    }
  }

  return "Жителів ще немає";
}

function formatParam(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function formatTestDate(value) {
  if (!value) {
    return "є дані тесту";
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

function getLastTestText(aquarium) {
  if (aquarium.lastTestText) {
    return aquarium.lastTestText;
  }

  const lastTest = aquarium.lastTest || aquarium.last_test;

  if (!lastTest) {
    return "Тестів ще немає";
  }

  if (typeof lastTest === "string") {
    return lastTest;
  }

  if (typeof lastTest === "object") {
    if (lastTest.days_ago === 0) {
      return "сьогодні";
    }

    if (lastTest.days_ago === 1) {
      return "1 день тому";
    }

    if (typeof lastTest.days_ago === "number") {
      return `${lastTest.days_ago} днів тому`;
    }

    const testDate =
      lastTest.test_date ||
      lastTest.created_at ||
      lastTest.date ||
      lastTest.createdAt ||
      null;

    return formatTestDate(testDate);
  }

  return "Тестів ще немає";
}

function getParamsText(aquarium) {
  const lastTest = aquarium.lastTest || aquarium.last_test;

  if (lastTest && typeof lastTest === "object") {
    return [
      `pH ${formatParam(lastTest.ph)}`,
      `GH ${formatParam(lastTest.gh)}`,
      `KH ${formatParam(lastTest.kh)}`,
      `NH3 ${formatParam(lastTest.nh3)}`,
      `NO2 ${formatParam(lastTest.no2)}`,
      `NO3 ${formatParam(lastTest.no3)}`,
    ].join(" · ");
  }

  if (
    aquarium.params &&
    typeof aquarium.params === "string" &&
    !aquarium.params.includes("pH —")
  ) {
    return aquarium.params;
  }

  return "pH — · GH — · KH — · NH3 — · NO2 — · NO3 —";
}

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
          src={getAquariumImage(aquarium)}
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
          {getAquariumVolume(aquarium)}
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
              {getPopulationText(aquarium)}
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
                {getLastTestText(aquarium)}
              </p>

              <p className="m-0 mt-[1px] font-semibold text-[#6b7280]">
                {getParamsText(aquarium)}
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

export default AquariumCard;