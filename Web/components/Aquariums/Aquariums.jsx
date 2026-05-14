"use client";

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import { EmptyAquariums } from "./EmptyAquariums";
import { AquariumCard } from "./AquariumCard";
import { WaterParamsModal } from "./WaterParamsModal";
import { TaskModal } from "./TaskModal";
import { AquariumSettingsModal } from "./AquariumSettingsModal";
import { AddAquariumModal } from "./AddAquariumModal";
import { DeleteAquariumModal } from "./DeleteAquariumModal";

import { useAquariumsApi } from "../../hooks/useAquariumsApi";

export function Aquariums() {
  const aquariums = useAquariumsApi();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Sidebar />

      <main
        className="
          px-4 pb-28 pt-6
          sm:px-6 sm:pb-32 sm:pt-8
          lg:ml-[88px] lg:px-16 lg:py-12
        "
      >
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
              mb-8 flex flex-col gap-5
              md:flex-row md:items-start md:justify-between
            "
          >
            <div>
              <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Ваші екосистеми
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Керуйте акваріумами, параметрами води та доглядом.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={aquariums.openCreateModal}
              whileHover={{
                y: -2,
                boxShadow: "0 16px 35px rgba(99,91,255,0.32)",
              }}
              whileTap={{ scale: 0.96 }}
              className="
                flex w-full items-center justify-center gap-2
                rounded-xl bg-[#635BFF] px-6 py-3
                text-sm font-black text-white transition hover:bg-[#5147f5]
                sm:w-fit
              "
            >
              <Plus size={17} />
              Додати акваріум
            </motion.button>
          </motion.header>

          {aquariums.aquariumsError && (
            <p className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
              {aquariums.aquariumsError}
            </p>
          )}

          {aquariums.isLoading && (
            <p className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500">
              Завантаження акваріумів...
            </p>
          )}

          {!aquariums.isLoading && aquariums.aquariums.length === 0 ? (
            <EmptyAquariums
              onCreate={aquariums.openCreateModal}
              onAdd={aquariums.openCreateModal}
            />
          ) : (
            <motion.section
              layout
              className="
                grid grid-cols-1 gap-6
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {aquariums.aquariums.map((aquarium, index) => (
                <AquariumCard
                  key={aquarium.id}
                  aquarium={aquarium}
                  index={index}
                  onOpenWaterParams={() =>
                    aquariums.openWaterParamsModal(aquarium)
                  }
                  onOpenTask={() => aquariums.openTaskModal(aquarium)}
                  onOpenSettings={() => aquariums.openSettingsModal(aquarium)}
                />
              ))}
            </motion.section>
          )}
        </div>
      </main>

      <motion.button
        type="button"
        onClick={aquariums.openCreateModal}
        whileHover={{
          scale: 1.12,
          rotate: 90,
          boxShadow: "0 22px 48px rgba(109,93,251,0.42)",
        }}
        whileTap={{ scale: 0.92 }}
        className="
          fixed bottom-24 right-5 z-30
          flex h-14 w-14 items-center justify-center
          rounded-full bg-gradient-to-br from-[#6D5DFB] via-[#7C3AED] to-[#9333EA]
          text-white shadow-[0_18px_40px_rgba(109,93,251,0.35)]
          lg:bottom-10 lg:right-12 lg:h-16 lg:w-16
        "
      >
        <Plus size={26} />
      </motion.button>

      <AnimatePresence>
        {aquariums.isAddOpen && (
          <AddAquariumModal
            isOpen={aquariums.isAddOpen}
            aquarium={aquariums.editingAquarium}
            onClose={aquariums.closeAddModal}
            onSave={aquariums.saveAquarium}
            isLoading={aquariums.isSaving}
          />
        )}
      </AnimatePresence>

      <WaterParamsModal
        isOpen={aquariums.isWaterParamsOpen}
        aquarium={aquariums.selectedAquarium}
        onClose={aquariums.closeWaterParamsModal}
        onSave={aquariums.saveWaterParamsLocally}
      />

      <TaskModal
        isOpen={aquariums.isTaskOpen}
        aquarium={aquariums.selectedAquarium}
        onClose={aquariums.closeTaskModal}
        onSave={aquariums.closeTaskModal}
      />

      <AquariumSettingsModal
        isOpen={aquariums.isSettingsOpen}
        aquarium={aquariums.selectedAquarium}
        onClose={aquariums.closeSettingsModal}
        onEdit={aquariums.openEditModal}
        onSave={aquariums.openEditModal}
        onDelete={aquariums.askDeleteAquarium}
      />

      <DeleteAquariumModal
        aquarium={aquariums.deletingAquarium}
        onClose={aquariums.cancelDeleteAquarium}
        onConfirm={aquariums.confirmDeleteAquarium}
        isLoading={aquariums.isSaving}
      />
    </div>
  );
}