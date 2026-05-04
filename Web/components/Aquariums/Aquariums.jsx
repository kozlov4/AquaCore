"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { EmptyAquariums } from "./EmptyAquariums";
import { AquariumCard } from "./AquariumCard";
import { WaterParamsModal } from "./WaterParamsModal";
import { TaskModal } from "./TaskModal";
import { AquariumSettingsModal } from "./AquariumSettingsModal";
import { AddAquariumModal } from "./AddAquariumModal";

const demoAquariums = [
  {
    id: 1,
    name: "Головний Травник",
    image: "/images/fish-card.jpg",
    volume: "60 л",
    environment: "Прісноводний",
    status: "Відмінний",
    population: "Неокардина, Родостомус (~30 шт)",
    lastTest: "Останній тест: 2 дні тому",
    params: "pH 7.2 · GH 8 · KH 4",
  },
  {
    id: 2,
    name: "Креветочник",
    image: "/images/fish-card.jpg",
    volume: "40 л",
    environment: "Креветочник",
    status: "Відмінний",
    population: "Неокардина, Родостомус (~30 шт)",
    lastTest: "Останній тест: 2 дні тому",
    params: "pH 7.2 · GH 8 · KH 4",
  },
];

export function Aquariums() {
  const [aquariums, setAquariums] = useState(demoAquariums);
  const [selectedAquarium, setSelectedAquarium] = useState(null);

  const [isAddAquariumOpen, setIsAddAquariumOpen] = useState(false);
  const [isWaterParamsOpen, setIsWaterParamsOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleCreateAquarium = (data) => {
    const newAquarium = {
      id: Date.now(),
      name: data.name,
      image: data.image,
      volume: data.volume,
      environment: data.environment,
      status: "Відмінний",
      population: "Жителів ще немає",
      lastTest: "Тестів ще немає",
      params: "pH — · GH — · KH —",
    };

    setAquariums((prev) => [...prev, newAquarium]);
  };

  const openModal = (aquarium, modalSetter) => {
    setSelectedAquarium(aquarium);
    modalSetter(true);
  };

  const handleSaveWaterParams = (params) => {
    setAquariums((prev) =>
      prev.map((aquarium) =>
        aquarium.id === selectedAquarium?.id
          ? {
              ...aquarium,
              lastTest: "Останній тест: сьогодні",
              params: `pH ${params.ph} · GH ${params.gh} · KH ${params.kh}`,
            }
          : aquarium
      )
    );

    setIsWaterParamsOpen(false);
  };

  const handleSaveSettings = (updatedAquarium) => {
    setAquariums((prev) =>
      prev.map((aquarium) =>
        aquarium.id === updatedAquarium.id ? updatedAquarium : aquarium
      )
    );
  };

  const handleDeleteAquarium = (id) => {
    setAquariums((prev) => prev.filter((aquarium) => aquarium.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFCFF] to-[#F4F7FF]">
      <Sidebar />

      <main className="ml-[88px] min-h-screen px-12 py-10">
        {aquariums.length === 0 ? (
          <EmptyAquariums onAdd={() => setIsAddAquariumOpen(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mb-12 text-center"
            >
              <h1 className="text-4xl font-light tracking-[0.12em] text-gray-950">
                Ваші екосистеми 🐠
              </h1>
            </motion.div>

            <section className="mx-auto grid max-w-[1220px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {aquariums.map((aquarium, index) => (
                <AquariumCard
                  key={aquarium.id}
                  aquarium={aquarium}
                  index={index}
                  onOpenWaterParams={() =>
                    openModal(aquarium, setIsWaterParamsOpen)
                  }
                  onOpenTask={() => openModal(aquarium, setIsTaskOpen)}
                  onOpenSettings={() => openModal(aquarium, setIsSettingsOpen)}
                />
              ))}
            </section>

            <motion.button
              type="button"
              onClick={() => setIsAddAquariumOpen(true)}
              whileHover={{
                scale: 1.12,
                rotate: 90,
                boxShadow: "0 22px 48px rgba(109,93,251,0.42)",
              }}
              whileTap={{ scale: 0.92 }}
              className="fixed bottom-10 right-12 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6D5DFB] via-[#7C3AED] to-[#9333EA] text-white shadow-[0_18px_40px_rgba(109,93,251,0.35)]"
            >
              <Plus size={34} />
            </motion.button>
          </motion.div>
        )}
      </main>

      <AddAquariumModal
        isOpen={isAddAquariumOpen}
        onClose={() => setIsAddAquariumOpen(false)}
        onSave={handleCreateAquarium}
      />

      <WaterParamsModal
        isOpen={isWaterParamsOpen}
        onClose={() => setIsWaterParamsOpen(false)}
        onSave={handleSaveWaterParams}
      />

      <TaskModal
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        onSave={() => setIsTaskOpen(false)}
      />

      <AquariumSettingsModal
        isOpen={isSettingsOpen}
        aquarium={selectedAquarium}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        onDelete={handleDeleteAquarium}
      />
    </div>
  );
}