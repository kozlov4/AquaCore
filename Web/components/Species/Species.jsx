"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Fish,
  Leaf,
  Shell,
  ChevronDown,
} from "lucide-react";

import { Sidebar } from "../Profile/Sidebar";
import { SpeciesCard } from "./SpeciesCard";
import { SpeciesAdvancedFiltersModal } from "./SpeciesAdvancedFiltersModal";
import { getSpeciesList } from "../../services/speciesApi";

const categoryOptions = [
  {
    label: "Усі риби",
    value: "all",
    icon: Fish,
  },
  {
    label: "Риби",
    value: "Риби",
    icon: Fish,
  },
  {
    label: "Рослини",
    value: "Рослини",
    icon: Leaf,
  },
  {
    label: "Безхребетні",
    value: "Безхребетні",
    icon: Shell,
  },
];

const waterOptions = [
  {
    label: "Прісна вода",
    value: "Прісна",
  },
  {
    label: "Морська вода",
    value: "Морська",
  },
  {
    label: "Будь-яка вода",
    value: "all",
  },
];

const characterOptions = [
  {
    label: "Будь-який характер",
    value: "all",
  },
  {
    label: "Мирні",
    value: "Мирні",
  },
  {
    label: "Територіальні",
    value: "Територіальні",
  },
  {
    label: "Хижаки",
    value: "Хижаки",
  },
];

const sortOptions = [
  {
    label: "За назвою",
    value: "name",
  },
  {
    label: "Спочатку менші",
    value: "size_asc",
  },
  {
    label: "Спочатку більші",
    value: "size_desc",
  },
  {
    label: "За мін. обʼємом",
    value: "volume_asc",
  },
];

function CategoryButton({ item, activeValue, onChange }) {
  const Icon = item.icon;
  const isActive = activeValue === item.value;

  return (
    <button
      type="button"
      onClick={() => onChange(item.value)}
      className={`
        inline-flex h-[38px] items-center justify-center gap-[7px]
        rounded-[8px] border px-[16px]
        text-[13px] font-extrabold transition-all duration-200
        ${
          isActive
            ? "border-[#dbeafe] bg-[#edf4ff] text-[#2563eb]"
            : "border-[#e8edf4] bg-white text-[#475467] hover:border-[#cfd7e6] hover:bg-[#fbfcff]"
        }
      `}
    >
      <Icon size={15} strokeWidth={2} />
      {item.label}
    </button>
  );
}

function SelectFilter({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-[38px] min-w-[185px] appearance-none rounded-[8px]
          border border-[#e8edf4] bg-white
          px-[14px] pr-[38px]
          text-[13px] font-extrabold text-[#475467]
          outline-none transition-all duration-200
          hover:border-[#cfd7e6]
          focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        strokeWidth={2.2}
        className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-[#635bff]"
      />
    </div>
  );
}

function getNumericSize(item) {
  const raw =
    item.maxSize ||
    item.max_size ||
    item.size ||
    item.size_cm ||
    "";

  if (typeof raw === "number") {
    return raw;
  }

  const numbers = String(raw).match(/\d+(\.\d+)?/g);

  if (!numbers || numbers.length === 0) {
    return 0;
  }

  return Number(numbers[numbers.length - 1]);
}

function getNumericVolume(item) {
  return Number(item.minVolume || item.min_volume || item.min_volume_l || 0);
}

export function Species() {
  const [species, setSpecies] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("all");
  const [waterType, setWaterType] = useState("Прісна");
  const [character, setCharacter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [maxSize, setMaxSize] = useState("S");
  const [difficulty, setDifficulty] = useState("Легкий");
  const [minVolume, setMinVolume] = useState(100);
  const [foodTypes, setFoodTypes] = useState(["Всеїдний"]);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speciesError, setSpeciesError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    async function loadSpecies() {
      try {
        setIsLoading(true);
        setSpeciesError("");

        const data = await getSpeciesList({
          search: debouncedSearch,
          category,
          waterType,
          character,
          sortBy,
          maxSize,
          difficulty,
          minVolume,
          foodTypes,
        });

        setSpecies(Array.isArray(data) ? data : []);
      } catch (error) {
        setSpecies([]);
        setSpeciesError(error.message || "Не вдалося завантажити види");
      } finally {
        setIsLoading(false);
      }
    }

    loadSpecies();
  }, [
    debouncedSearch,
    category,
    waterType,
    character,
    sortBy,
    maxSize,
    difficulty,
    minVolume,
    foodTypes,
  ]);

  const visibleSpecies = useMemo(() => {
    const list = [...species];

    if (sortBy === "name") {
      return list.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "uk")
      );
    }

    if (sortBy === "size_asc") {
      return list.sort((a, b) => getNumericSize(a) - getNumericSize(b));
    }

    if (sortBy === "size_desc") {
      return list.sort((a, b) => getNumericSize(b) - getNumericSize(a));
    }

    if (sortBy === "volume_asc") {
      return list.sort((a, b) => getNumericVolume(a) - getNumericVolume(b));
    }

    return list;
  }, [species, sortBy]);

  const resetAllFilters = () => {
    setSearchValue("");
    setCategory("all");
    setWaterType("Прісна");
    setCharacter("all");
    setSortBy("name");
    setMaxSize("S");
    setDifficulty("Легкий");
    setMinVolume(100);
    setFoodTypes(["Всеїдний"]);
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <section
        className="
          min-h-screen px-5 py-8
          md:ml-[280px] md:px-8
          xl:px-10
        "
      >
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-[26px] flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.035em] text-[#111827]">
                Енциклопедія видів
              </h1>

              <p className="mt-[7px] text-[14px] font-semibold text-[#98a2b3]">
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
                className="
                  h-[44px] w-full rounded-[10px] border border-[#e7ebf2]
                  bg-white pl-[43px] pr-4 text-[13px] font-semibold text-[#111827]
                  outline-none transition-all duration-200
                  placeholder:text-[#98a2b3]
                  focus:border-[#cfd7e6] focus:ring-4 focus:ring-[#eef3ff]
                "
              />
            </div>
          </header>

          <div
            className="
              mb-[28px] rounded-[14px] border border-[#edf0f5] bg-white
              px-[14px] py-[14px]
              shadow-[0_8px_24px_rgba(15,23,42,0.025)]
            "
          >
            <div className="flex flex-wrap items-center gap-[10px]">
              {categoryOptions.map((item) => (
                <CategoryButton
                  key={item.value}
                  item={item}
                  activeValue={category}
                  onChange={setCategory}
                />
              ))}

              <SelectFilter
                value={waterType}
                onChange={setWaterType}
                options={waterOptions}
              />

              <SelectFilter
                value={character}
                onChange={setCharacter}
                options={characterOptions}
              />

              <SelectFilter
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />

              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className="
                  ml-auto inline-flex h-[38px] items-center justify-center gap-[7px]
                  rounded-[8px] border border-[#e8edf4] bg-white px-[16px]
                  text-[13px] font-extrabold text-[#635bff]
                  transition-all duration-200 hover:bg-[#f4f2ff]
                "
              >
                <SlidersHorizontal size={15} />
                Всі фільтри
              </button>
            </div>
          </div>

          {speciesError && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {speciesError}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[300px] animate-pulse rounded-[14px] border border-[#edf0f5] bg-[#f8fafc]"
                />
              ))}
            </div>
          ) : visibleSpecies.length > 0 ? (
            <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-4">
              {visibleSpecies.map((item, index) => (
                <SpeciesCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-10 text-center">
              <p className="text-[16px] font-bold text-[#111827]">
                Нічого не знайдено
              </p>

              <p className="mt-2 text-[13px] text-[#8a93a3]">
                Спробуйте змінити пошук або скинути фільтри.
              </p>

              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 rounded-xl bg-[#635bff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#554df0]"
              >
                Скинути фільтри
              </button>
            </div>
          )}
        </div>
      </section>

      <SpeciesAdvancedFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        maxSize={maxSize}
        setMaxSize={setMaxSize}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        minVolume={minVolume}
        setMinVolume={setMinVolume}
        foodTypes={foodTypes}
        setFoodTypes={setFoodTypes}
        onReset={resetAllFilters}
      />
    </main>
  );
}

export default Species;