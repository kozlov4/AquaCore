"use client";

import { useEffect, useMemo, useState } from "react";
import { AddSpeciesToAquariumModal } from "./AddSpeciesToAquariumModal";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  Droplets,
  Fish,
  Home,
  Ruler,
  Star,
  Thermometer,
  Timer,
  Utensils,
  Waves,
  Leaf,
  Gauge,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import { getSpeciesById } from "../../services/speciesApi";

function getSpeciesIcon(species) {
  if (species?.icon) return species.icon;

  const category = String(species?.category || "").toLowerCase();

  if (category.includes("рослин")) return "🌿";
  if (category.includes("безхреб")) return "🦐";

  return "🐟";
}

function DetailCard({ icon: Icon, emoji, title, value, color }) {
  const styles = {
    yellow: {
      card: "from-[#fff9e6] to-[#fff3c4] border-[#fde68a]",
      icon: "bg-[#fff7cc] text-[#f59e0b] shadow-[0_10px_26px_rgba(245,158,11,0.18)]",
    },
    green: {
      card: "from-[#ecfdf3] to-[#d9fbe8] border-[#bbf7d0]",
      icon: "bg-[#dcfce7] text-[#16a34a] shadow-[0_10px_26px_rgba(22,163,74,0.18)]",
    },
    pink: {
      card: "from-[#fff1f7] to-[#ffe4ef] border-[#fbcfe8]",
      icon: "bg-[#fce7f3] text-[#db2777] shadow-[0_10px_26px_rgba(219,39,119,0.18)]",
    },
    purple: {
      card: "from-[#f4f0ff] to-[#ede9fe] border-[#ddd6fe]",
      icon: "bg-[#ede9fe] text-[#7c3aed] shadow-[0_10px_26px_rgba(124,58,237,0.18)]",
    },
    red: {
      card: "from-[#fff1f2] to-[#ffe4e6] border-[#fecdd3]",
      icon: "bg-[#ffe4e6] text-[#e11d48] shadow-[0_10px_26px_rgba(225,29,72,0.18)]",
    },
    orange: {
      card: "from-[#fff7ed] to-[#ffedd5] border-[#fed7aa]",
      icon: "bg-[#ffedd5] text-[#ea580c] shadow-[0_10px_26px_rgba(234,88,12,0.18)]",
    },
    blue: {
      card: "from-[#eff6ff] to-[#dbeafe] border-[#bfdbfe]",
      icon: "bg-[#dbeafe] text-[#2563eb] shadow-[0_10px_26px_rgba(37,99,235,0.18)]",
    },
    cyan: {
      card: "from-[#ecfeff] to-[#cffafe] border-[#a5f3fc]",
      icon: "bg-[#cffafe] text-[#0891b2] shadow-[0_10px_26px_rgba(8,145,178,0.18)]",
    },
  };

  const selected = styles[color] || styles.blue;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className={`
        relative overflow-hidden rounded-[20px] border bg-gradient-to-br
        ${selected.card}
        p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)]
      `}
    >
      <div className="pointer-events-none absolute right-[-24px] top-[-24px] h-24 w-24 rounded-full bg-white/45 blur-xl" />

      <div
        className={`
          relative mb-5 flex h-12 w-12 items-center justify-center
          rounded-[16px] ${selected.icon}
        `}
      >
        {emoji ? (
          <span className="text-[25px] leading-none">{emoji}</span>
        ) : (
          <Icon size={24} strokeWidth={2.3} />
        )}
      </div>

      <p className="relative text-[13px] font-black uppercase tracking-[0.04em] text-[#7b8798]">
        {title}
      </p>

      <p className="relative mt-2 text-[18px] font-black text-[#071126]">
        {value || "—"}
      </p>
    </motion.div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex h-[28px] items-center rounded-full bg-[#f1efff] px-4 text-[13px] font-extrabold text-[#635bff]">
      {children}
    </span>
  );
}

export function SpeciesDetails() {
  const router = useRouter();
  const speciesId = router.query.id;

  const [species, setSpecies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speciesError, setSpeciesError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady || !speciesId) return;

    async function loadSpeciesDetails() {
      try {
        setIsLoading(true);
        setSpeciesError("");

        const data = await getSpeciesById(speciesId);

        setSpecies(data);
      } catch (error) {
        setSpecies(null);
        setSpeciesError(error.message || "Не вдалося завантажити вид");
      } finally {
        setIsLoading(false);
      }
    }

    loadSpeciesDetails();
  }, [router.isReady, speciesId]);

  const cards = useMemo(() => {
    if (!species) return [];

    return [
      {
        icon: Star,
        emoji: "⭐",
        title: "Складність",
        value: species.difficulty,
        color: "yellow",
      },
      {
        icon: Home,
        emoji: "🏡",
        title: "Мін. обʼєм",
        value: species.minVolume ? `від ${species.minVolume} л` : "—",
        color: "green",
      },
      {
        icon: Fish,
        emoji: "🐠",
        title: "Характер",
        value: species.character,
        color: "pink",
      },
      {
        icon: Ruler,
        emoji: "📏",
        title: "Розмір",
        value: species.size,
        color: "purple",
      },
      {
        icon: Thermometer,
        emoji: "🌡️",
        title: "Температура",
        value: species.temperature,
        color: "red",
      },
      {
        icon: Utensils,
        emoji: "🍽️",
        title: "Тип живлення",
        value: species.diet,
        color: "orange",
      },
      {
        icon: Timer,
        emoji: "⏳",
        title: "Тривалість життя",
        value: species.lifespan,
        color: "blue",
      },
      {
        icon: Droplets,
        emoji: "💧",
        title: "Кислотність pH",
        value: species.ph,
        color: "cyan",
      },
    ];
  }, [species]);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#071126]">
      <Sidebar />

      <section className="min-h-screen px-5 py-8 md:ml-[280px] md:px-8 xl:px-10">
        <div className="mx-auto max-w-[1260px]">
          <button
            type="button"
            onClick={() => router.push("/species")}
            className="mb-8 inline-flex items-center gap-2 text-[15px] font-extrabold text-[#635bff] transition hover:translate-x-[-3px]"
          >
            <ArrowLeft size={17} />
            Назад до каталогу
          </button>

          {isLoading && (
            <div className="rounded-[26px] border border-[#edf0f5] bg-white p-10 text-center text-[15px] font-bold text-[#98a2b3] shadow-sm">
              Завантаження виду...
            </div>
          )}

          {speciesError && (
            <div className="rounded-[18px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
              {speciesError}
            </div>
          )}

          {!isLoading && species && (
            <>
              <section className="overflow-hidden rounded-[30px] border border-[#dfe5ef] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <div className="grid grid-cols-1 lg:grid-cols-[430px_1fr]">
                  <div className="flex min-h-[360px] items-center justify-center bg-[#eaf8ff] p-10">
                    {species.imageUrl ? (
                      <img
                        src={species.imageUrl}
                        alt={species.name}
                        className="max-h-[280px] w-full max-w-[330px] object-contain"
                      />
                    ) : (
                      <span className="text-[96px] leading-none">
                        {getSpeciesIcon(species)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-center px-8 py-10 lg:px-12">
                    <div className="mb-8 flex flex-wrap gap-3">
                      <Badge>{species.water}</Badge>
                      <Badge>{species.category}</Badge>
                    </div>

                    <h1 className="text-[44px] font-black leading-none tracking-[-0.05em] text-[#050b1f] md:text-[56px]">
                      {species.name}
                    </h1>

                    {species.latin && (
                      <p className="mt-4 text-[20px] font-medium italic text-[#8a98b3]">
                        {species.latin}
                      </p>
                    )}

                    <p className="mt-9 max-w-[760px] text-[16px] font-medium leading-8 text-[#344054]">
                      {species.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="
                        mt-8 inline-flex h-[52px] w-fit items-center justify-center gap-2
                        rounded-[13px] bg-[#635bff] px-8
                        text-[16px] font-extrabold text-white
                        shadow-[0_18px_38px_rgba(99,91,255,0.28)]
                        transition hover:bg-[#544cf0]
                      "
                    >
                      <Plus size={19} />
                      Додати в акваріум
                    </button>
                  </div>
                </div>
              </section>

              <section className="mt-9 rounded-[30px] border border-[#edf0f5] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.04)]">
                <h2 className="mb-8 text-[28px] font-black tracking-[-0.04em] text-[#071126]">
                  Умови утримання
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {cards.map((card) => (
                    <DetailCard
                      key={card.title}
                      icon={card.icon}
                      emoji={card.emoji}
                      title={card.title}
                      value={card.value}
                      color={card.color}
                    />
                  ))}
                </div>

                {(species.lighting || species.co2) && (
                  <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {species.lighting && (
                      <DetailCard
                        icon={Leaf}
                        emoji="🌿"
                        title="Освітлення"
                        value={species.lighting}
                        color="green"
                      />
                    )}

                    {species.co2 && (
                      <DetailCard
                        icon={Gauge}
                        emoji="🫧"
                        title="CO₂"
                        value={species.co2}
                        color="cyan"
                      />
                    )}
                  </div>
                )}
              </section>

              <section className="mt-9 rounded-[30px] border border-[#edf0f5] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#eff6ff] text-[#2563eb]">
                    <Waves size={24} />
                  </div>

                  <div>
                    <h2 className="text-[24px] font-black tracking-[-0.04em] text-[#071126]">
                      Опис виду
                    </h2>

                    <p className="mt-3 text-[16px] font-medium leading-8 text-[#475467]">
                      {species.description}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </section>

      <AddSpeciesToAquariumModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        species={species}
      />
    </main>
  );
}

export default SpeciesDetails;