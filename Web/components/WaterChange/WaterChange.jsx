"use client";

import { ChevronDown, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { CycleStatusCard } from "./CycleStatusCard";
import { OperationHistory } from "./OperationHistory";
import { WaterPrepareCard } from "./WaterPrepareCard";
import { DisciplineCard } from "./DisciplineCard";

export function WaterChange() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-10">
        <div className="mx-auto max-w-[920px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Графік підмін води
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Контролюйте чистоту екосистеми та обʼєми води
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-[#635BFF]/40">
                Головний Травник (60 Л)
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              <button className="rounded-xl border border-slate-200 p-3 text-slate-500 shadow-sm transition hover:border-[#635BFF]/40 hover:text-[#635BFF]">
                <Settings size={17} />
              </button>
            </div>
          </motion.header>

          <CycleStatusCard />

          <div className="mt-8 grid grid-cols-[1fr_280px] gap-7">
            <OperationHistory />

            <aside className="space-y-5">
              <WaterPrepareCard />
              <DisciplineCard />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}