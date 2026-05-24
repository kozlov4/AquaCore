"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Fish,
  Leaf,
  Shell,
  Droplets,
  Zap,
  BadgeCheck,
} from "lucide-react";

import { Sidebar } from "../Profile/Sidebar";

const species = [
  {
    id: 1,
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    emoji: "🐟",
    category: "Риби",
    water: "Прісна",
    character: "Мирні",
    tags: [
      { label: "від 20 л", type: "water" },
      { label: "Мирна", type: "safe" },
    ],
  },
  {
    id: 2,
    name: "Астронотус (Оскар)",
    latin: "Astronotus ocellatus",
    emoji: "🐠",
    category: "Риби",
    water: "Прісна",
    character: "Хижаки",
    tags: [
      { label: "від 250 л", type: "water" },
      { label: "Хижак", type: "danger" },
    ],
  },
  {
    id: 3,
    name: "Анубіас нана",
    latin: "Anubias barteri var. nana",
    emoji: "🌿",
    category: "Рослини",
    water: "Прісна",
    character: "Мирні",
    tags: [
      { label: "Слабке світло", type: "light" },
      { label: "Без CO2", type: "neutral" },
    ],
  },
  {
    id: 4,
    name: "Креветка Амано",
    latin: "Caridina multidentata",
    emoji: "🦐",
    category: "Безхребетні",
    water: "Прісна",
    character: "Мирні",
    tags: [
      { label: "від 10 л", type: "water" },
      { label: "Водоростейд", type: "safe" },
    ],
  },
  {
    id: 5,
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    emoji: "🐟",
    category: "Риби",
    water: "Прісна",
    character: "Мирні",
    tags: [
      { label: "від 20 л", type: "water" },
      { label: "Мирна", type: "safe" },
    ],
  },
  {
    id: 6,
    name: "Астронотус (Оскар)",
    latin: "Astronotus ocellatus",
    emoji: "🐠",
    category: "Риби",
    water: "Прісна",
    character: "Хижаки",
    tags: [
      { label: "від 250 л", type: "water" },
      { label: "Хижак", type: "danger" },
    ],
  },
  {
    id: 7,
    name: "Анубіас нана",
    latin: "Anubias barteri var. nana",
    emoji: "🌿",
    category: "Рослини",
    water: "Прісна",
    character: "Мирні",
    tags: [
      { label: "Слабке світло", type: "light" },
      { label: "Без CO2", type: "neutral" },
    ],
  },
  {
    id: 8,
    name: "Креветка Амано",
    latin: "Caridina multidentata",
    emoji: "🦐",
    category: "Безхребетні",
    water: "Прісна",
    character: "Мирні",
    tags: [
      { label: "від 10 л", type: "water" },
      { label: "Водоростейд", type: "safe" },
    ],
  },
];

const categoryOptions = [
  { label: "Усі риби", value: "all", icon: Fish },
  { label: "Риби", value: "Риби", icon: Fish },
  { label: "Рослини", value: "Рослини", icon: Leaf },
  { label: "Безхребетні", value: "Безхребетні", icon: Shell },
];

const waterOptions = [
  { label: "Будь-яка вода", value: "all" },
  { label: "Прісна вода", value: "Прісна" },
  { label: "Морська вода", value: "Морська" },
];

const characterOptions = [
  { label: "Будь-який характер", value: "all" },
  { label: "Мирні", value: "Мирні" },
  { label: "Хижаки", value: "Хижаки" },
  { label: "Територіальні", value: "Територіальні" },
];

function FilterPill({ value, activeValue, onChange, children, icon: Icon }) {
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex h-[42px] min-w-[168px] items-center justify-center gap-2 rounded-[9px] border px-4 text-[13px] font-semibold transition-all duration-200 ${
        isActive
          ? "border-[#dfe7f5] bg-white text-[#1f2937] shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
          : "border-[#eef1f6] bg-[#fbfcfe] text-[#4b5563] hover:border-[#dfe7f5] hover:bg-white"
      }`}
    >
      {Icon && <Icon size={15} strokeWidth={1.8} className="text-[#4c83ff]" />}
      <span>{children}</span>
    </button>
  );
}

function TagBadge({ tag }) {
  const styles = {
    water: "bg-[#eaf4ff] text-[#1785ff]",
    safe: "bg-[#e8f8ee] text-[#1f9d55]",
    danger: "bg-[#ffe8e8] text-[#e11d48]",
    light: "bg-[#fff5d7] text-[#c47a00]",
    neutral: "bg-[#f2f4f7] text-[#475467]",
  };

  const icons = {
    water: <Droplets size={11} />,
    safe: <BadgeCheck size={11} />,
    danger: <Zap size={11} />,
    light: <span className="text-[11px]">☀</span>,
    neutral: null,
  };

  return (
    <span
      className={`inline-flex h-[22px] items-center gap-[4px] rounded-[5px] px-[7px] text-[11px] font-semibold ${
        styles[tag.type] || styles.neutral
      }`}
    >
      {icons[tag.type]}
      {tag.label}
    </span>
  );
}

function SpeciesCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
      whileHover={{
        y: -3,
        boxShadow: "0 18px 36px rgba(15,23,42,0.07)",
      }}
      className="group overflow-hidden rounded-[15px] border border-[#edf0f5] bg-white p-[14px] shadow-[0_8px_24px_rgba(15,23,42,0.025)] transition-all duration-300"
    >
      <div className="relative flex h-[154px] items-center justify-center overflow-hidden rounded-[10px] bg-[#f8fafc]">
        <span className="absolute right-[10px] top-[8px] rounded-[5px] bg-white px-[8px] py-[4px] text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#667085] shadow-sm">
          {item.water}
        </span>

        <div className="text-[58px] transition-transform duration-300 group-hover:scale-110">
          {item.emoji}
        </div>
      </div>

      <div className="pt-[14px]">
        <h3 className="m-0 text-[15px] font-extrabold leading-tight text-[#111827]">
          {item.name}
        </h3>

        <p className="mt-[2px] text-[11px] italic leading-tight text-[#6b7280]">
          {item.latin}
        </p>

        <div className="mt-[12px] flex flex-wrap gap-[6px]">
          {item.tags.map((tag) => (
            <TagBadge key={`${item.id}-${tag.label}`} tag={tag} />
          ))}
        </div>

        <Link
          href={`/species-details?id=${item.id}`}
          className="mt-[14px] flex h-[34px] items-center justify-center rounded-[7px] bg-[#fafafa] text-[13px] font-bold text-[#374151] transition-all duration-200 hover:bg-[#f4f2ff] hover:text-[#635bff]"
        >
          Детальніше
        </Link>
      </div>
    </motion.article>
  );
}

export function Species() {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("all");
  const [waterType, setWaterType] = useState("Прісна");
  const [character, setCharacter] = useState("all");

  const filteredSpecies = useMemo(() => {
    return species.filter((item) => {
      const search = searchValue.trim().toLowerCase();

      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.latin.toLowerCase().includes(search);

      const matchesCategory = category === "all" || item.category === category;
      const matchesWater = waterType === "all" || item.water === waterType;
      const matchesCharacter =
        character === "all" || item.character === character;

      return matchesSearch && matchesCategory && matchesWater && matchesCharacter;
    });
  }, [searchValue, category, waterType, character]);

  const resetFilters = () => {
    setCategory("all");
    setWaterType("all");
    setCharacter("all");
    setSearchValue("");
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[280px] md:px-10 lg:px-[54px]">
        <header className="mb-[34px] flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.03em] text-[#111827]">
              Енциклопедія видів
            </h1>

            <p className="mt-[6px] text-[14px] font-medium text-[#8a93a3]">
              Знайдіть ідеальних жителів для вашої екосистеми
            </p>
          </div>

          <div className="relative w-full lg:w-[390px]">
            <Search
              size={17}
              strokeWidth={2}
              className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#667085]"
            />

            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Пошук за назвою..."
              className="h-[44px] w-full rounded-[10px] border border-[#e7ebf2] bg-white pl-[44px] pr-4 text-[13px] font-medium text-[#111827] outline-none transition-all duration-200 placeholder:text-[#98a2b3] focus:border-[#cfd7e6] focus:ring-4 focus:ring-[#eef3ff]"
            />
          </div>
        </header>

        <div className="mb-[30px] flex min-h-[56px] items-center justify-between gap-4 rounded-[14px] border border-[#edf0f5] bg-white px-[14px] py-[9px] shadow-[0_8px_24px_rgba(15,23,42,0.025)]">
          <div className="flex flex-wrap items-center gap-[10px]">
            <FilterPill
              value="all"
              activeValue={category}
              onChange={setCategory}
              icon={Fish}
            >
              Усі риби
            </FilterPill>

            <FilterPill
              value="Прісна"
              activeValue={waterType}
              onChange={setWaterType}
            >
              Прісна вода
            </FilterPill>

            <FilterPill
              value="all"
              activeValue={character}
              onChange={setCharacter}
            >
              Будь-який характер
            </FilterPill>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex h-[38px] shrink-0 items-center gap-2 rounded-[9px] px-3 text-[13px] font-bold text-[#635bff] transition-all duration-200 hover:bg-[#f4f2ff]"
          >
            <SlidersHorizontal size={15} strokeWidth={2} />
            Всі фільтри
          </button>
        </div>

        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredSpecies.map((item, index) => (
            <SpeciesCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {filteredSpecies.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-10 text-center">
            <p className="text-[16px] font-bold text-[#111827]">
              Нічого не знайдено
            </p>
            <p className="mt-2 text-[13px] text-[#8a93a3]">
              Спробуйте змінити пошук або скинути фільтри.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-[#635bff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#554df0]"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Species;