"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { AddSpeciesToAquariumModal } from "./AddSpeciesToAquariumModal";
import { useSpeciesDetails } from "../../hooks/useSpecies";

export function SpeciesDetails() {
  const router = useRouter();
  const { id } = router.query;

  const details = useSpeciesDetails(id);

  const species = details.species;

  const conditions = species
    ? [
        { icon: "⭐", label: "Складність", value: species.difficulty },
        {
          icon: "🏠",
          label: "Мін. обʼєм",
          value: `від ${species.minVolume || 0} л`,
        },
        { icon: "🧠", label: "Характер", value: species.character },
        { icon: "📏", label: "Розмір", value: species.size },
        { icon: "🌡️", label: "Температура", value: species.temperature },
        { icon: "🍽️", label: "Тип живлення", value: species.diet },
        { icon: "⏳", label: "Тривалість життя", value: species.lifespan },
        { icon: "💧", label: "Кислотність pH", value: species.ph },
      ]
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFF]">
      <Sidebar />

      <main
        className="
          px-4 pb-28 pt-6
          sm:px-6 sm:pb-32 sm:pt-8
          lg:ml-[88px] lg:px-16 lg:py-12
        "
      >
        <div className="mx-auto max-w-[1050px]">
          <Link
            href="/species"
            className="inline-flex text-sm font-black text-[#635BFF] hover:underline"
          >
            ← Назад до каталогу
          </Link>

          {details.speciesError && (
            <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
              {details.speciesError}
            </p>
          )}

          {details.isLoading && (
            <p className="mt-6 rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm font-bold text-slate-500">
              Завантаження виду...
            </p>
          )}

          {species && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
                  <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#ECFEFF] text-8xl">
                    {species.imageUrl ? (
                      <img
                        src={species.imageUrl}
                        alt={species.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      species.icon || "🐟"
                    )}
                  </div>

                  <div className="p-7 sm:p-10">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#635BFF]/10 px-3 py-1 text-xs font-black text-[#635BFF]">
                        {species.water} вода
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {species.category}
                      </span>
                    </div>

                    <h1 className="mt-5 text-3xl font-black text-slate-950 sm:text-5xl">
                      {species.name}
                    </h1>

                    <p className="mt-2 text-lg italic text-slate-400">
                      {species.latin}
                    </p>

                    <p className="mt-6 text-sm leading-7 text-slate-600">
                      {species.description}
                    </p>

                    <motion.button
                      type="button"
                      onClick={() => details.setIsModalOpen(true)}
                      whileHover={{
                        y: -2,
                        boxShadow: "0 16px 35px rgba(99,91,255,0.35)",
                      }}
                      whileTap={{ scale: 0.96 }}
                      className="
                        mt-7 rounded-xl bg-[#635BFF] px-6 py-3
                        text-sm font-black text-white
                        shadow-[0_14px_30px_rgba(99,91,255,0.28)]
                        transition hover:bg-[#5147F5]
                      "
                    >
                      + Додати в акваріум
                    </motion.button>
                  </div>
                </div>
              </motion.section>

              <section className="mt-8 rounded-[32px] border border-white/80 bg-white p-7 shadow-sm sm:p-10">
                <h2 className="text-2xl font-black text-slate-950">
                  Умови утримання
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {conditions.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <p className="mt-3 text-xs font-black uppercase text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-800">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <AddSpeciesToAquariumModal
        isOpen={details.isModalOpen}
        onClose={() => details.setIsModalOpen(false)}
        species={species}
        aquariums={details.aquariums}
        onSave={details.handleAddToAquarium}
        isLoading={details.isSaving}
      />
    </div>
  );
}
