"use client";

import { motion } from "framer-motion";
import { Task } from "./Task";
import { AlertBox } from "./AlertBox";

export function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-[1fr_360px] gap-6">
        <section className="rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur transition-all duration-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
          <h2 className="mb-7 text-center text-xl font-bold text-gray-900">
            Останні показники води
          </h2>

          <div className="grid grid-cols-3 gap-5">
            {[
              ["PH", "7.2"],
              ["GH", "8"],
              ["KH", "4"],
            ].map(([label, value]) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, scale: 1.03 }}
                className="rounded-2xl bg-gray-50 p-5 transition hover:bg-[#5B4CF6]/5"
              >
                <p className="text-xs font-medium text-gray-400">{label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {value}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur transition-all duration-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            Найближчі завдання
          </h2>

          <div className="space-y-5">
            <Task title="Підміна води 30%" badge="Сьогодні" urgent />
            <Task title="Очищення фільтра" badge="Через 3 дні" />
          </div>
        </section>
      </div>

      <AlertBox
        type="warning"
        title="Високе біологічне навантаження"
        text="Кількість жителів перевищує рекомендовану для 60 літрів. Рекомендуємо посилити аерацію та робити підміни води частіше."
        button="Аналіз населення"
      />

      <AlertBox
        type="danger"
        title="Критичний рівень Аміаку (NH3)"
        text="Останній тест показав небезпечний рівень токсинів. Ризики для жителів стрімко зростають."
        button="Зробити підміну 30%"
      />
    </motion.div>
  );
}