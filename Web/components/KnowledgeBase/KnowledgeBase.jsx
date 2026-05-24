"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  PenLine,
  Plus,
  FlaskConical,
  Leaf,
  Stethoscope,
  Wrench,
  ShieldAlert,
  Clock3,
} from "lucide-react";

import { Sidebar } from "../Profile/Sidebar";

const tabs = ["Всі статті", "Офіційні", "Спільнота", "Мої статті"];

const categoryFilters = [
  {
    label: "Хімія води",
    value: "water",
    icon: FlaskConical,
  },
  {
    label: "Акваскейпінг",
    value: "aquascaping",
    icon: Leaf,
  },
  {
    label: "Лікування хвороб",
    value: "diseases",
    icon: Stethoscope,
  },
  {
    label: "Обладнання",
    value: "equipment",
    icon: Wrench,
  },
  {
    label: "Безхребетні",
    value: "invertebrates",
    icon: ShieldAlert,
  },
];

const articles = [
  {
    id: 1,
    label: "ОФІЦІЙНИЙ ГАЙД",
    source: "Офіційні",
    category: "Хімія води",
    categoryValue: "water",
    title: "Азотний цикл для початківців: Запуск акваріума",
    description:
      "Детальний розбір того, як працюють бактерії в фільтрі, чому не можна запускати риб у перший день і як уникнути синдрому нового акваріума.",
    author: "AquaCore Team",
    readTime: "5 хв читання",
    emoji: "🧪",
    coverClass: "bg-gradient-to-br from-[#211965] via-[#2c247f] to-[#16133f]",
    labelClass: "bg-[#635bff] text-white",
    categoryClass: "text-[#2563eb]",
    avatarClass: "bg-[#dff7ef]",
  },
  {
    id: 2,
    label: "СПІЛЬНОТА",
    source: "Спільнота",
    category: "Акваскейпінг",
    categoryValue: "aquascaping",
    title: "Мій досвід вирощування ґрунтопокривних рослин без CO2",
    description:
      "Монте-Карло та Глоссостігма без подачі вуглекислого газу — це реально. Ділюся своїм режимом освітлення та добривами.",
    author: "Олексій М.",
    readTime: "5 хв читання",
    emoji: "🌿",
    coverClass: "bg-[#cdf8df]",
    labelClass: "bg-white text-[#475467]",
    categoryClass: "text-[#16a34a]",
    avatarClass: "bg-[#fff2b8]",
  },
  {
    id: 3,
    label: "СПІЛЬНОТА",
    source: "Спільнота",
    category: "Лікування хвороб",
    categoryValue: "diseases",
    title: "Як я вилікував іхтіофтіріоз (Манку) підвищенням температури",
    description:
      "Покрокова інструкція лікування без використання агресивної хімії та міді. Важливо для акваріумів з креветками.",
    author: "Марія В.",
    readTime: "5 хв читання",
    emoji: "🩺",
    coverClass: "bg-[#ffe0e5]",
    labelClass: "bg-white text-[#475467]",
    categoryClass: "text-[#ef4444]",
    avatarClass: "bg-[#ffe0b8]",
  },
];

function CategoryFilter({ item, activeCategory, setActiveCategory }) {
  const Icon = item.icon;
  const isActive = activeCategory === item.value;

  return (
    <button
      type="button"
      onClick={() => setActiveCategory(isActive ? "all" : item.value)}
      className={`inline-flex h-[28px] items-center gap-[6px] rounded-full border px-[11px] text-[10px] font-bold transition-all duration-200 ${
        isActive
          ? "border-[#dce8ff] bg-[#edf4ff] text-[#2563eb]"
          : "border-[#e8edf4] bg-white text-[#667085] hover:border-[#d8deea] hover:bg-[#fbfcff]"
      }`}
    >
      <Icon size={12} strokeWidth={2} />
      {item.label}
    </button>
  );
}

function ArticleCard({ article, index }) {
  return (
    <motion.article
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
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 18px 38px rgba(15,23,42,0.08)",
      }}
      className="overflow-hidden rounded-[14px] border border-[#e8edf4] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.025)] transition-all duration-300"
    >
      <div
        className={`relative flex h-[154px] items-center justify-center overflow-hidden ${article.coverClass}`}
      >
        <span
          className={`absolute left-[12px] top-[12px] rounded-[6px] px-[9px] py-[5px] text-[9px] font-extrabold uppercase tracking-[0.04em] ${article.labelClass}`}
        >
          {article.label}
        </span>

        <span className="text-[52px] drop-shadow-sm">{article.emoji}</span>
      </div>

      <div className="p-[18px]">
        <p className={`mb-[8px] text-[10px] font-extrabold ${article.categoryClass}`}>
          {article.category}
        </p>

        <h3 className="mb-[10px] line-clamp-2 text-[16px] font-extrabold leading-[1.25] tracking-[-0.02em] text-[#111827]">
          {article.title}
        </h3>

        <p className="line-clamp-3 text-[12px] font-medium leading-[1.65] text-[#7b8494]">
          {article.description}
        </p>

        <div className="mt-[22px] flex items-center justify-between border-t border-[#f1f3f7] pt-[13px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${article.avatarClass}`}
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#667085]" />
            </span>

            <span className="truncate text-[11px] font-bold text-[#475467]">
              {article.author}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-[5px] text-[10px] font-semibold text-[#98a2b3]">
            <Clock3 size={12} />
            {article.readTime}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function KnowledgeBase() {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("Всі статті");
  const [activeCategory, setActiveCategory] = useState("water");

  const filteredArticles = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !search ||
        article.title.toLowerCase().includes(search) ||
        article.description.toLowerCase().includes(search) ||
        article.author.toLowerCase().includes(search) ||
        article.category.toLowerCase().includes(search);

      const matchesTab =
        activeTab === "Всі статті" || article.source === activeTab;

      const matchesCategory =
        activeCategory === "all" || article.categoryValue === activeCategory;

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [searchValue, activeTab, activeCategory]);

  const resetFilters = () => {
    setSearchValue("");
    setActiveTab("Всі статті");
    setActiveCategory("all");
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[96px]">
        <div className="mx-auto max-w-[1050px]">
          <header className="mb-[30px] flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.03em] text-[#111827]">
                База знань
              </h1>

              <p className="mt-[6px] text-[13px] font-medium text-[#98a2b3]">
                Офіційні посібники та досвід спільноти акваріумістів
              </p>
            </div>

            <div className="flex flex-wrap gap-[12px]">
              <button
                type="button"
                className="inline-flex h-[36px] items-center justify-center gap-[8px] rounded-[9px] bg-[#9ca3af] px-[19px] text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(156,163,175,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8b94a1]"
              >
                <PenLine size={14} />
                Дописати статтю
              </button>

              <button
                type="button"
                className="inline-flex h-[36px] items-center justify-center gap-[8px] rounded-[9px] bg-[#554dff] px-[19px] text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(85,77,255,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#463ee8]"
              >
                <Plus size={15} />
                Написати статтю
              </button>
            </div>
          </header>

          <div className="mb-[22px] flex flex-col gap-3 rounded-[14px] border border-[#edf0f5] bg-white p-[10px] shadow-[0_8px_24px_rgba(15,23,42,0.025)] lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                strokeWidth={2}
                className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#667085]"
              />

              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Пошук статей, посібників або авторів..."
                className="h-[39px] w-full rounded-[9px] border border-[#e7ebf2] bg-white pl-[43px] pr-4 text-[12px] font-medium text-[#111827] outline-none transition-all duration-200 placeholder:text-[#98a2b3] focus:border-[#cfd7e6] focus:ring-4 focus:ring-[#eef3ff]"
              />
            </div>

            <div className="flex h-[39px] shrink-0 items-center rounded-[9px] border border-[#e8edf4] bg-white p-[3px]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-[31px] rounded-[7px] px-[14px] text-[11px] font-extrabold transition-all duration-200 ${
                      isActive
                        ? "bg-[#f6f7fb] text-[#111827]"
                        : "text-[#667085] hover:bg-[#f9fafb] hover:text-[#111827]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-[26px] flex flex-wrap items-center gap-[9px]">
            {categoryFilters.map((item) => (
              <CategoryFilter
                key={item.value}
                item={item}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-10 text-center">
              <p className="text-[16px] font-bold text-[#111827]">
                Статті не знайдено
              </p>

              <p className="mt-2 text-[13px] text-[#8a93a3]">
                Спробуйте змінити пошуковий запит, вкладку або категорію.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-[#554dff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#463ee8]"
              >
                Скинути фільтри
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}