"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { DashboardStats } from "./DashboardStats";
import { DashboardAlert } from "./DashboardAlert";
import { TodayPlan } from "./TodayPlan";
import { WaterStatusCard } from "./WaterStatusCard";
import { RecentEvents } from "./RecentEvents";
import { QuickActionMenu } from "./QuickActionMenu";
import { NotificationsPanel } from "./NotificationsPanel";

export function Dashboard() {
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-8">
        <div className="mx-auto max-w-[1180px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between rounded-[28px] border border-slate-100 bg-white px-6 py-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5E9FF] text-2xl font-black text-[#635BFF]">
                CK
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-950">
                  Добрий вечір, Сергію 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Пʼятниця, 24 Квітня 2026 року
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-[#635BFF]"
              >
                <Bell size={20} />

                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setIsQuickOpen(true)}
                whileHover={{
                  y: -2,
                  boxShadow: "0 16px 35px rgba(99,91,255,0.32)",
                }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
              >
                <Plus size={18} />
                Швидка дія
              </motion.button>
            </div>
          </motion.header>

          <DashboardStats />

          <div className="mt-7 grid grid-cols-[1fr_350px] gap-7">
            <section className="space-y-7">
              <DashboardAlert />
              <TodayPlan />
            </section>

            <aside className="space-y-7">
              <WaterStatusCard />
              <RecentEvents />
            </aside>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isQuickOpen && (
          <QuickActionMenu onClose={() => setIsQuickOpen(false)} />
        )}

        {isNotificationsOpen && (
          <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}