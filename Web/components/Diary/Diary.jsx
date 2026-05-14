"use client";

import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { DiaryFilters } from "./DiaryFilters";
import { DiaryCard } from "./DiaryCard";
import { AddDiaryEntryModal } from "./AddDiaryEntryModal";
import { DiaryDetailsModal } from "./DiaryDetailsModal";
import { DeleteDiaryModal } from "./DeleteDiaryModal";
import { useDiary } from "../../hooks/useDiary";

export function Diary() {
  const diary = useDiary();

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
              mb-6 flex flex-col gap-5
              md:flex-row md:items-start md:justify-between
            "
          >
            <div>
              <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Щоденник спостережень
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Зберігайте важливі моменти та аналізуйте поведінку екосистеми
              </p>
            </div>

            <motion.button
              type="button"
              onClick={diary.openCreateModal}
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
              <Pencil size={16} />
              Новий запис
            </motion.button>
          </motion.header>

          <DiaryFilters
            search={diary.search}
            setSearch={diary.setSearch}
            aquariums={diary.aquariums}
            selectedAquariumId={diary.selectedAquariumId}
            setSelectedAquariumId={diary.setSelectedAquariumId}
            selectedTag={diary.selectedTag}
            setSelectedTag={diary.setSelectedTag}
          />

          {diary.diaryError && (
            <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
              {diary.diaryError}
            </p>
          )}

          {diary.isLoading && (
            <p className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500">
              Завантаження записів...
            </p>
          )}

          {diary.isEntryLoading && (
            <p className="mt-4 rounded-2xl border border-[#635BFF]/10 bg-[#635BFF]/10 px-5 py-4 text-sm font-bold text-[#635BFF]">
              Відкриття запису...
            </p>
          )}

          {!diary.isLoading && diary.entries.length === 0 && (
            <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center">
              <p className="text-5xl">📘</p>
              <h3 className="mt-4 text-xl font-black text-slate-950">
                Записів ще немає
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Створіть перший запис у щоденнику.
              </p>
            </div>
          )}

          <motion.section
            layout
            className="
              mt-8 grid grid-cols-1 gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {diary.entries.map((entry, index) => (
              <DiaryCard
                key={entry.id}
                entry={entry}
                index={index}
                onOpen={() => diary.openEntry(entry)}
              />
            ))}
          </motion.section>
        </div>
      </main>

           <AnimatePresence>
        {diary.isCreateOpen && (
          <AddDiaryEntryModal
            aquariums={diary.aquariums}
            entry={diary.editingEntry}
            onClose={diary.closeCreateModal}
            onSave={diary.saveEntry}
            isLoading={diary.isSaving}
          />
        )}
      </AnimatePresence>

      <DiaryDetailsModal
        entry={diary.selectedEntry}
        onClose={diary.closeEntry}
        onEdit={diary.openEditModal}
        onDelete={diary.askDeleteEntry}
      />

      <DeleteDiaryModal
        entry={diary.deletingEntry}
        onClose={diary.cancelDeleteEntry}
        onConfirm={diary.confirmDeleteEntry}
        isLoading={diary.isSaving}
      />
    </div>
  );
}
