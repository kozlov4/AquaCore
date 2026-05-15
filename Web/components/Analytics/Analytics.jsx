"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { AnalyticsFilters } from "./AnalyticsFilters";
import { AnalyticsChart } from "./AnalyticsChart";
import { AnalyticsStatCard } from "./AnalyticsStatCard";

const stats = [
  {
    title: "Поточний стан",
    value: "7.2",
    description: "✓ В нормі",
    type: "success",
  },
  {
    title: "Середнє значення",
    value: "7.1",
    description: "за місяць",
    type: "default",
  },
  {
    title: "Максимум / Стрибок",
    value: "7.8",
    description: "18 Квітня",
    type: "danger",
  },
  {
    title: "Мінімум",
    value: "6.8",
    description: "5 Квітня",
    type: "default",
  },
];

export function Analytics() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-10">
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Аналітика показників
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Відслідковуйте стабільність параметрів у часі
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{
                y: -2,
                boxShadow: "0 14px 30px rgba(15,23,42,0.1)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#635BFF]/30 hover:text-[#635BFF]"
            >
              <Download size={17} />
              Експорт даних
            </motion.button>
          </motion.header>

          <AnalyticsFilters />

          <AnalyticsChart />

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="mt-6 grid grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <AnalyticsStatCard key={stat.title} stat={stat} index={index} />
            ))}
          </motion.section>
        </div>
      </main>
    </div>
  );
}