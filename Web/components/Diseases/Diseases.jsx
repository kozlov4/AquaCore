"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { Header } from "../Profile/Header";
import { DiseaseCard } from "./DiseaseCard";
import { DiseaseDetailsModal } from "./DiseaseDetailsModal";

const diseases = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: index % 3 === 0 ? "Туберкульоз риб" : "Манка / Іхтіофтіріоз",
  type: "fish",
  danger: index % 3 === 0 ? "high" : "medium",
  tags: ["білі_крапки", "скребіння", "дихання_біля_дна"],
  symptoms: ["схуднення", "виснаження", "викривлення", "інфекційна"],
  diagnostics: [
    "Поступове схуднення попри нормальне харчування",
    "Викривлення хребта",
    "Западання черевця",
    "Млявість, самотність",
  ],
  reason:
    "Мікобактерії — дуже стійкі. Передаються через канібалізм, заражену рибу, необроблений живий корм.",
  treatment: [
    "Підтвердіть підозру — зверніться до іхтіопатолога.",
    "Відсадити та ізолювати хвору рибу.",
    "Карантин нових риб мінімум 4 тижні.",
    "При роботі з акваріумом — надягайте рукавички.",
  ],
}));

const filters = [
  "Всі",
  "Дивна поведінка",
  "Плями на шкірі/лусці",
  "Проблеми з плавниками",
];

export function Diseases() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Всі");
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const filteredDiseases = useMemo(() => {
    return diseases.filter((disease) => {
      const titleMatch = disease.title.toLowerCase().includes(debouncedSearch);

      const tagsMatch = disease.tags.some((tag) =>
        tag.toLowerCase().includes(debouncedSearch)
      );

      const symptomsMatch = disease.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(debouncedSearch)
      );

      const matchesSearch =
        debouncedSearch === "" || titleMatch || tagsMatch || symptomsMatch;

      const matchesFilter =
        activeFilter === "Всі" ||
        disease.tags
          .join(" ")
          .toLowerCase()
          .includes(activeFilter.toLowerCase()) ||
        disease.symptoms
          .join(" ")
          .toLowerCase()
          .includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [debouncedSearch, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFCFF] to-[#F4F7FF]">
      <Sidebar />

      <div className="ml-[88px]">
        <Header />

        <motion.main
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="px-12 py-10"
        >
          <div className="mx-auto max-w-[1180px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="text-center"
            >
              <p className="mb-2 text-sm font-semibold text-[#5B4CF6]">
                Акваріумна база знань
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-gray-950">
                Енциклопедія хвороб
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Знайди хворобу за симптомом або назвою
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="mx-auto mt-8 flex max-w-[560px] items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur transition focus-within:border-[#5B4CF6] focus-within:ring-4 focus-within:ring-[#5B4CF6]/10"
            >
              <Search size={19} className="text-gray-400" />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Введіть симптом або назву хвороби..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.4 }}
              className="mt-5 flex justify-center gap-3"
            >
              <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                🐟 Риби
              </span>
              <span className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm">
                🦐 Безхребетні
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-7 flex flex-wrap justify-center gap-3"
            >
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`rounded-full cursor-pointer border px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "border-[#5B4CF6]/20 bg-[#5B4CF6] text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)]"
                      : "border-gray-200 bg-white text-gray-700 shadow-sm hover:border-[#5B4CF6]/30 hover:text-[#5B4CF6]"
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </motion.div>

            {filteredDiseases.length > 0 ? (
              <motion.section
                layout
                className="mt-11 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
              >
                {filteredDiseases.map((disease, index) => (
                  <motion.div
                    key={disease.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                  >
                    <DiseaseCard
                      disease={disease}
                      searchValue={debouncedSearch}
                      onOpen={setSelectedDisease}
                    />
                  </motion.div>
                ))}
              </motion.section>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-20 rounded-3xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm"
              >
                <div className="text-5xl">😔</div>
                <p className="mt-4 text-lg font-semibold text-gray-800">
                  Нічого не знайдено
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Спробуйте змінити запит або обрати інший фільтр.
                </p>
              </motion.div>
            )}
          </div>
        </motion.main>
      </div>

      <DiseaseDetailsModal
        disease={selectedDisease}
        onClose={() => setSelectedDisease(null)}
      />
    </div>
  );
}