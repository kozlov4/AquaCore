"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, MoreHorizontal, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Sidebar } from "../Profile/Sidebar";
import { AddResidentModal } from "./AddResidentModal";
import { AddEquipmentModal } from "./AddEquipmentModal";

const tabs = ["Огляд", "Параметри води", "Населення", "Обладнання"];

export function AquariumDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Огляд");
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);

  const [residents, setResidents] = useState([
    {
      name: "Неон звичайний",
      latin: "Paracheirodon innesi",
      count: "30 шт",
      icon: "🐟",
    },
    {
      name: "Креветка Амано",
      latin: "Caridina multidentata",
      count: "15 шт",
      icon: "🦐",
    },
  ]);

  const [equipment, setEquipment] = useState([
    {
      icon: "⚙️",
      name: "Зовнішній фільтр Tetra EX 800 Plus",
      desc: "Потужність: 800 л/год • очищення раз на 3 міс.",
      date: "12 Жов 2025",
    },
    {
      icon: "💡",
      name: "Світильник Chihiros WRGB II",
      desc: "Графік: 8 год/день • інтенсивність 70%",
      date: "01 Січ 2026",
    },
  ]);

  const handleAddResident = (resident) => {
    setResidents((prev) => [
      ...prev,
      {
        name: resident.species.name,
        latin: resident.species.latin,
        count: `${resident.count} шт`,
        icon: resident.species.icon,
      },
    ]);
  };

  const handleAddEquipment = (device) => {
    setEquipment((prev) => [
      ...prev,
      {
        icon: "⚙️",
        name: device.model,
        desc: `${device.category} • обслуговування: ${device.serviceInterval}`,
        date: device.installedDate,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFCFF] to-[#F4F7FF]">
      <Sidebar />

      <main className="ml-[88px] px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-[980px]"
        >
          <motion.button
            onClick={() => router.back()}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.96 }}
            className="mb-5 flex items-center text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={22} />
          </motion.button>

          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative h-[220px] overflow-hidden rounded-3xl shadow-[0_22px_70px_rgba(15,23,42,0.18)]"
          >
            <Image
              src="/images/fish-card.jpg"
              alt="aquarium"
              fill
              className="object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            <div className="absolute right-5 top-5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              Стан: Відмінний
            </div>

            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold">Головний Травник</h1>
              <p className="mt-2 text-sm text-white/80">
                Прісноводний • 60 л • Запущений: 12.10.2023
              </p>
            </div>
          </motion.section>

          <nav className="mt-6 flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-t-xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#5B4CF6]/5 text-[#5B4CF6]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab}

                {activeTab === tab && (
                  <motion.div
                    layoutId="aquarium-tab"
                    className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#5B4CF6]"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {activeTab === "Огляд" && <OverviewTab key="overview" />}

              {activeTab === "Параметри води" && (
                <WaterParamsTab key="water" />
              )}

              {activeTab === "Населення" && (
                <PopulationTab
                  key="population"
                  residents={residents}
                  onAddResident={() => setIsAddResidentOpen(true)}
                />
              )}

              {activeTab === "Обладнання" && (
                <EquipmentTab
                  key="equipment"
                  equipment={equipment}
                  onAddEquipment={() => setIsAddEquipmentOpen(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <AddResidentModal
        isOpen={isAddResidentOpen}
        onClose={() => setIsAddResidentOpen(false)}
        onSave={handleAddResident}
      />

      <AddEquipmentModal
        isOpen={isAddEquipmentOpen}
        onClose={() => setIsAddEquipmentOpen(false)}
        onSave={handleAddEquipment}
      />
    </div>
  );
}

function OverviewTab() {
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

function WaterParamsTab() {
  const rows = [
    ["Сьогодні, 10:30", "7.2", "8", "0.0"],
    ["15 Квітня 2026", "7.4", "8", "0.0"],
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[760px] rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur"
    >
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Історія показників води
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Регулярні тести допомагають підтримувати баланс
          </p>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,76,246,0.22)]"
        >
          + Додати тест
        </motion.button>
      </div>

      <table className="w-full overflow-hidden rounded-2xl text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-900">
          <tr>
            <th className="px-5 py-4">Дата</th>
            <th className="px-5 py-4">PH</th>
            <th className="px-5 py-4">GH</th>
            <th className="px-5 py-4">Аміак</th>
            <th className="px-5 py-4">Дія</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row[0]}
              className="border-b border-gray-100 transition hover:bg-[#5B4CF6]/5"
            >
              <td className="px-5 py-5 text-gray-700">{row[0]}</td>
              <td className="px-5 py-5">
                <span className="rounded-md bg-green-100 px-2 py-1 text-green-700">
                  {row[1]}
                </span>
              </td>
              <td className="px-5 py-5 text-gray-700">{row[2]}</td>
              <td className="px-5 py-5 text-gray-700">{row[3]}</td>
              <td className="px-5 py-5 text-gray-400">
                <MoreHorizontal size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}

function PopulationTab({ residents, onAddResident }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[760px] rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur"
    >
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Населення акваріума
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Загальна кількість: {residents.length} види
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onAddResident}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,76,246,0.22)]"
        >
          + Додати жителів
        </motion.button>
      </div>

      <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <p className="font-bold text-green-700">✅ Сумісність відмінна</p>
        <p className="mt-1 text-sm text-green-600">
          Всі види мирні та підходять для поточних параметрів води.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {residents.map((resident, index) => (
          <Resident key={`${resident.name}-${index}`} {...resident} />
        ))}
      </div>
    </motion.section>
  );
}

function EquipmentTab({ equipment, onAddEquipment }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[760px] rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur"
    >
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Технічне оснащення
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Фільтрація, світло, CO₂ та обігрів
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onAddEquipment}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,76,246,0.22)]"
        >
          + Додати пристрій
        </motion.button>
      </div>

      <div className="space-y-4">
        {equipment.map((item, index) => (
          <Equipment key={`${item.name}-${index}`} {...item} />
        ))}
      </div>
    </motion.section>
  );
}

function Task({ title, badge, urgent }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between rounded-xl p-2 transition hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Square size={18} />
        <span className="text-sm text-gray-700">{title}</span>
      </div>

      <span
        className={urgent ? "text-xs text-red-500" : "text-xs text-gray-400"}
      >
        {badge}
      </span>
    </motion.div>
  );
}

function AlertBox({ type, title, text, button }) {
  const isDanger = type === "danger";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex items-center justify-between rounded-2xl border p-5 transition ${
        isDanger
          ? "border-red-200 bg-red-50"
          : "border-orange-200 bg-orange-50"
      }`}
    >
      <div>
        <h3
          className={
            isDanger ? "font-bold text-red-700" : "font-bold text-orange-700"
          }
        >
          {isDanger ? "🚨" : "🐠"} {title}
        </h3>
        <p
          className={
            isDanger
              ? "mt-1 text-sm text-red-600"
              : "mt-1 text-sm text-orange-600"
          }
        >
          {text}
        </p>
      </div>

      <button
        className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition active:scale-95 ${
          isDanger
            ? "bg-red-500 hover:bg-red-600"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {button}
      </button>
    </motion.div>
  );
}

function Resident({ name, latin, count, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#5B4CF6]/20 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-400">{latin}</p>
        </div>
      </div>

      <p className="font-bold text-gray-900">{count}</p>
    </motion.div>
  );
}

function Equipment({ icon, name, desc, date }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="flex items-center justify-between rounded-2xl bg-gray-50 p-5 transition hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-400">{desc}</p>
        </div>
      </div>

      <div className="text-right text-xs text-gray-400">
        <p>Встановлено</p>
        <p className="font-semibold text-gray-600">{date}</p>
      </div>
    </motion.div>
  );
}