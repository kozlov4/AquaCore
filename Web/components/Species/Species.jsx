"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

import { Sidebar } from "../Profile/Sidebar";
import { SpeciesCard } from "./SpeciesCard";
import { SpeciesAdvancedFiltersModal } from "./SpeciesAdvancedFiltersModal";
import { SpeciesFilterDropdown } from "./SpeciesFilterDropdown";
import { getSpeciesList } from "../../services/speciesApi";

const categoryOptions = [
  {
    label: "Усі риби",
    value: "all",
    icon: "🐟",
  },
  {
    label: "Риби",
    value: "Риби",
    icon: "🐟",
  },
  {
    label: "Рослини",
    value: "Рослини",
    icon: "🌿",
  },
  {
    label: "Безхребетні",
    value: "Безхребетні",
    icon: "🦐",
  },
];

const waterOptions = [
  {
    label: "Будь-яка вода",
    value: "all",
  },
  {
    label: "Прісна",
    value: "Прісна",
  },
  {
    label: "Морська",
    value: "Морська",
  },
  {
    label: "Солонувата (Brackish)",
    value: "Солонувата",
  },
];

const characterOptions = [
  {
    label: "Усі види",
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
    danger: true,
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
    value: "volume",
  },
];

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getNumericValue(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const preparedValue = String(value).replace(",", ".");
  const match = preparedValue.match(/\d+(\.\d+)?/);

  return match ? Number(match[0]) : 0;
}

function matchesValue(actual, expected) {
  if (!expected || expected === "all") {
    return true;
  }

  return normalizeText(actual).includes(normalizeText(expected));
}

function getSizeLimit(maxSize) {
  if (maxSize === "S") return 5;
  if (maxSize === "M") return 10;
  if (maxSize === "L") return 20;
  if (maxSize === "XL") return 999;

  return 999;
}

export function Species() {
  const [species, setSpecies] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("all");
  const [waterType, setWaterType] = useState("all");
  const [character, setCharacter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [maxSize, setMaxSize] = useState("XL");
  const [difficulty, setDifficulty] = useState("all");
  const [minVolume, setMinVolume] = useState(500);
  const [foodTypes, setFoodTypes] = useState([]);

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
  }, [debouncedSearch]);

  const visibleSpecies = useMemo(() => {
    let list = [...species];

    const search = normalizeText(debouncedSearch);

    if (search) {
      list = list.filter((item) => {
        return (
          normalizeText(item.name).includes(search) ||
          normalizeText(item.latin).includes(search)
        );
      });
    }

    list = list.filter((item) => matchesValue(item.category, category));
    list = list.filter((item) => matchesValue(item.water, waterType));
    list = list.filter((item) => matchesValue(item.character, character));

    if (maxSize && maxSize !== "all") {
      const limit = getSizeLimit(maxSize);

      list = list.filter((item) => {
        const size = getNumericValue(item.maxSize || item.size);

        if (!size) return true;

        return size <= limit;
      });
    }

    if (difficulty && difficulty !== "all") {
      list = list.filter((item) => matchesValue(item.difficulty, difficulty));
    }

    if (minVolume) {
      list = list.filter((item) => {
        const volume = Number(item.minVolume || 0);

        if (!volume) return true;

        return volume <= Number(minVolume);
      });
    }

    if (Array.isArray(foodTypes) && foodTypes.length > 0) {
      list = list.filter((item) => {
        const diet = normalizeText(item.diet);

        return foodTypes.some((foodType) =>
          diet.includes(normalizeText(foodType))
        );
      });
    }

    if (sortBy === "name") {
      list.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "uk")
      );
    }

    if (sortBy === "volume") {
      list.sort(
        (a, b) => Number(a.minVolume || 0) - Number(b.minVolume || 0)
      );
    }

    if (sortBy === "size_asc") {
      list.sort(
        (a, b) =>
          getNumericValue(a.maxSize || a.size) -
          getNumericValue(b.maxSize || b.size)
      );
    }

    if (sortBy === "size_desc") {
      list.sort(
        (a, b) =>
          getNumericValue(b.maxSize || b.size) -
          getNumericValue(a.maxSize || a.size)
      );
    }

    return list;
  }, [
    species,
    debouncedSearch,
    category,
    waterType,
    character,
    maxSize,
    difficulty,
    minVolume,
    foodTypes,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchValue("");
    setDebouncedSearch("");
    setCategory("all");
    setWaterType("all");
    setCharacter("all");
    setSortBy("name");
    setMaxSize("XL");
    setDifficulty("all");
    setMinVolume(500);
    setFoodTypes([]);
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
        <div className="mx-auto max-w-[1320px]">
          <header className="mb-[34px] flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="m-0 text-[32px] font-extrabold tracking-[-0.04em] text-[#071126]">
                Енциклопедія видів
              </h1>

              <p className="mt-[12px] text-[15px] font-bold text-[#98a2b3]">
                Знайдіть ідеальних жителів для вашої екосистеми
              </p>
            </div>

            <div className="relative w-full lg:w-[430px]">
              <Search
                size={20}
                strokeWidth={2}
                className="absolute left-[17px] top-1/2 -translate-y-1/2 text-[#667085]"
              />

              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Пошук за назвою..."
                className="
                  h-[54px] w-full rounded-[12px] border border-[#e3e9f2]
                  bg-white pl-[54px] pr-4 text-[15px] font-bold text-[#111827]
                  outline-none transition-all duration-200
                  placeholder:text-[#98a2b3]
                  focus:border-[#cfd7e6] focus:ring-4 focus:ring-[#eef3ff]
                "
              />
            </div>
          </header>

          <div
            className="
              mb-[34px] rounded-[18px] border border-[#edf0f5]
              bg-white p-[16px]
              shadow-[0_16px_42px_rgba(15,23,42,0.04)]
            "
          >
            <div className="flex flex-wrap items-center gap-[14px]">
              <SpeciesFilterDropdown
                title="Категорія"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />

              <SpeciesFilterDropdown
                title="Тип води"
                value={waterType}
                onChange={setWaterType}
                options={waterOptions}
              />

              <SpeciesFilterDropdown
                title="Характер"
                value={character}
                onChange={setCharacter}
                options={characterOptions}
                accent={false}
              />

              <SpeciesFilterDropdown
                title="Сортування"
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />

              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className="
                  ml-auto inline-flex h-[44px] items-center justify-center gap-[9px]
                  rounded-[10px] border border-[#e3e9f2] bg-white px-[20px]
                  text-[14px] font-extrabold text-[#635bff]
                  shadow-[0_8px_22px_rgba(15,23,42,0.03)]
                  transition-all duration-200
                  hover:bg-[#f4f2ff] hover:border-[#d8d3ff]
                "
              >
                <SlidersHorizontal size={17} />
                Всі фільтри
              </button>

              <button
                type="button"
                onClick={resetAllFilters}
                className="
                  inline-flex h-[44px] items-center justify-center gap-[8px]
                  rounded-[10px] px-[16px]
                  text-[14px] font-extrabold text-[#64748b]
                  transition-all duration-200
                  hover:bg-[#f8fafc] hover:text-[#111827]
                "
              >
                <RotateCcw size={16} />
                Скинути
              </button>
            </div>
          </div>

          {speciesError && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {speciesError}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[300px] animate-pulse rounded-[14px] border border-[#edf0f5] bg-[#f8fafc]"
                />
              ))}
            </div>
          ) : visibleSpecies.length > 0 ? (
            <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 xl:grid-cols-4">
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