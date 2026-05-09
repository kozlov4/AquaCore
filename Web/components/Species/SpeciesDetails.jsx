"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { AddSpeciesToAquariumModal } from "./AddSpeciesToAquariumModal";

const conditions = [
  { icon: "🌱", label: "Складність", value: "Легкий" },
  { icon: "💧", label: "Мін. обʼєм", value: "від 40 л" },
  { icon: "👥", label: "Характер", value: "Мирна, зграйна" },
  { icon: "🔄", label: "Макс. розмір", value: "5 см (4 см)" },
  { icon: "🌡️", label: "Температура", value: "22 - 26 °C" },
  { icon: "🍽️", label: "Тип живлення", value: "Всеїдні (Сухий корм)" },
  { icon: "💚", label: "Тривалість життя", value: "3 - 5 років" },
  { icon: "💦", label: "Кислотність (pH)", value: "6.0 - 7.0" },
];

export function SpeciesDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] p-8">
        <section className="relative min-h-[650px] overflow-hidden rounded-lg bg-slate-100">
          <div className="relative h-[250px] rounded-t-lg bg-gradient-to-r from-[#23135F] via-[#3828A0] to-[#21194F]">
            <Link href="/species">
              <button className="absolute left-6 top-6 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-black/35 hover:text-white">
                ← Назад до каталогу
              </button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="absolute left-1/2 top-[72px] -translate-x-1/2 text-6xl drop-shadow-2xl"
            >
              🐟
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="
              relative z-10
              mx-auto
              -mt-24
              w-[920px]
              rounded-[24px]
              bg-white
              px-8
              py-4
              shadow-[0_18px_45px_rgba(15,23,42,0.14)]
            "
          >
            <div className="flex items-start justify-between pb-2">
              <div>
                <div className="mb-2 flex gap-2">
                  <span className="rounded-md bg-[#635BFF]/10 px-2 py-1 text-[10px] font-black uppercase text-[#635BFF]">
                    Прісна вода
                  </span>

                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500">
                    Риба
                  </span>
                </div>

                <h1 className="text-[42px] font-black leading-none tracking-tight text-slate-950">
                  Неон звичайний
                </h1>

                <p className="mt-1 text-sm italic text-slate-500">
                  Paracheirodon innesi
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => setIsModalOpen(true)}
                whileHover={{
                  y: -2,
                  boxShadow: "0 16px 35px rgba(99,91,255,0.35)",
                }}
                whileTap={{ scale: 0.96 }}
                className="
                  rounded-xl
                  bg-[#635BFF]
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-[0_14px_30px_rgba(99,91,255,0.28)]
                  transition-all
                  duration-300
                  hover:bg-[#5147F5]
                  hover:-translate-y-1
                "
              >
                + Додати в акваріум
              </motion.button>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-slate-900">
                Огляд
              </h2>

              <p className="text-[13px] leading-6 text-slate-600">
                Неон звичайний — одна з найпопулярніших прісноводних
                акваріумних риб. Її характерна риса — яскрава синя смуга, що
                світиться і проходить вздовж усього тіла, та червона смуга
                біля хвоста. Це мирна, зграйна рибка, яка ідеально підходить
                для початківців та загальних акваріумів-травників.
                Рекомендується утримувати зграйками від 6–10 особин.
              </p>
            </div>

            <div className="mt-4">
              <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-slate-900">
                Умови утримання
              </h2>

              <div className="grid grid-cols-4 gap-2.5">
                {conditions.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.03 }}
                    whileHover={{ y: -3 }}
                    className="
                      rounded-[16px]
                      bg-slate-50
                      px-3
                      py-2.5
                      min-h-[88px]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-white
                      hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]
                    "
                  >
                    <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                      {item.icon}
                    </div>

                    <p className="text-[10px] font-medium text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-[11px] font-black text-slate-950">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <AddSpeciesToAquariumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}