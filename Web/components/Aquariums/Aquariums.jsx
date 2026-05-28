"use client";

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import { EmptyAquariums } from "./EmptyAquariums";
import { AquariumCard } from "./AquariumCard";
import { WaterParamsModal } from "./WaterParamsModal";
import { TaskModal } from "./TaskModal";
import { AddAquariumModal } from "./AddAquariumModal";
import { DeleteAquariumModal } from "./DeleteAquariumModal";

import { useAquariumsApi } from "../../hooks/useAquariumsApi";

export function Aquariums() {
  const aquariums = useAquariumsApi();

  const hasAquariums =
    Array.isArray(aquariums.aquariums) && aquariums.aquariums.length > 0;

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <main
        className="
          min-h-screen
          px-4 pb-28 pt-8
          sm:px-6 sm:pt-10
          lg:ml-[88px] lg:px-12 lg:py-10
        "
      >
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-9 flex items-center justify-center gap-3"
          >
            <h1
              className="
                text-center text-[18px] font-medium tracking-[0.14em]
                text-[#111827]
              "
            >
              Ваші екосистеми
            </h1>

            <span className="text-[34px] leading-none">🐠</span>
          </motion.div>

          {aquariums.aquariumsError && (
            <div className="mx-auto mb-6 max-w-[900px] rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {aquariums.aquariumsError}
            </div>
          )}

          {aquariums.isLoading && (
            <div className="mx-auto mb-6 max-w-[900px] rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-slate-500 shadow-sm">
              Завантаження акваріумів...
            </div>
          )}

          {!aquariums.isLoading && !hasAquariums ? (
            <EmptyAquariums onCreate={aquariums.openCreateModal} />
          ) : (
            !aquariums.isLoading && (
              <motion.div
                layout
                className="
                  grid gap-x-4 gap-y-7
                  sm:grid-cols-2
                  xl:grid-cols-3
                  2xl:grid-cols-4
                "
              >
                <AnimatePresence mode="popLayout">
                  {aquariums.aquariums.map((aquarium, index) => (
                    <AquariumCard
                      key={aquarium.id}
                      aquarium={aquarium}
                      index={index}
                      onOpenWaterParams={() =>
                        aquariums.openWaterParamsModal(aquarium)
                      }
                      onOpenTask={() => aquariums.openTaskModal(aquarium)}
                      onOpenSettings={() =>
                        aquariums.openSettingsModal(aquarium)
                      }
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </div>
      </main>

      <motion.button
        type="button"
        onClick={aquariums.openCreateModal}
        initial={{ opacity: 0, scale: 0.8, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="
          fixed bottom-7 right-7 z-40
          flex h-12 w-12 items-center justify-center
          rounded-full bg-[#7657ff] text-white
          shadow-[0_14px_35px_rgba(118,87,255,0.35)]
          transition hover:bg-[#6547f3]
          md:bottom-8 md:right-9
        "
        aria-label="Додати акваріум"
        title="Додати акваріум"
      >
        <Plus size={25} strokeWidth={2.5} />
      </motion.button>

      <AddAquariumModal
        isOpen={aquariums.isAddOpen}
        aquarium={aquariums.editingAquarium}
        onClose={aquariums.closeAddModal}
        onSave={aquariums.saveAquarium}
        isLoading={aquariums.isSaving}
      />

      <WaterParamsModal
        isOpen={aquariums.isWaterParamsOpen}
        aquarium={aquariums.selectedAquarium}
        onClose={aquariums.closeWaterParamsModal}
        onSave={aquariums.saveWaterParams}
        isLoading={aquariums.isSaving}
      />

      <TaskModal
        isOpen={aquariums.isTaskOpen}
        aquarium={aquariums.selectedAquarium}
        aquariumNames={aquariums.aquariumNames}
        onClose={aquariums.closeTaskModal}
        isLoading={aquariums.isSaving}
      />

      <DeleteAquariumModal
        isOpen={Boolean(aquariums.deletingAquarium)}
        aquarium={aquariums.deletingAquarium}
        onClose={aquariums.cancelDeleteAquarium}
        onConfirm={aquariums.confirmDeleteAquarium}
        isLoading={aquariums.isSaving}
      />
    </div>
  );
}

export default Aquariums;