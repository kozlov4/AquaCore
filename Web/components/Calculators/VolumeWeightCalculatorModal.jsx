"use client";

import { useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function VolumeWeightCalculatorModal({ isOpen, onClose }) {
  const [length, setLength] = useState(60);
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(35);
  const [glassThickness, setGlassThickness] = useState(5);

  const result = useMemo(() => {
    const grossVolume = (length * width * height) / 1000;

    const thicknessCm = glassThickness / 10;
    const innerLength = Math.max(length - thicknessCm * 2, 0);
    const innerWidth = Math.max(width - thicknessCm * 2, 0);
    const innerHeight = Math.max(height - thicknessCm, 0);

    const netVolume = (innerLength * innerWidth * innerHeight) / 1000;
    const weight = netVolume + 12;

    return {
      grossVolume: grossVolume.toFixed(1),
      netVolume: netVolume.toFixed(1),
      weight: Math.round(weight),
    };
  }, [length, width, height, glassThickness]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed left-1/2 top-1/2 z-50 w-[660px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-7 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5E9FF] text-2xl">
              📐
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Розрахунок обʼєму та ваги
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Введіть зовнішні розміри акваріума
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_240px] gap-7 px-7 py-7">
          <div className="space-y-5">
            <CalculatorInput
              label="Довжина (Спереду)"
              value={length}
              onChange={setLength}
            />

            <CalculatorInput
              label="Ширина (Глибина)"
              value={width}
              onChange={setWidth}
            />

            <CalculatorInput
              label="Висота"
              value={height}
              onChange={setHeight}
            />

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Товщина скла
              </label>

              <button
                type="button"
                onClick={() =>
                  setGlassThickness((prev) =>
                    prev === 5 ? 6 : prev === 6 ? 8 : prev === 8 ? 10 : 5
                  )
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-300 px-4 py-3 text-left text-base font-bold text-slate-900 transition hover:border-[#635BFF] focus:border-[#635BFF]"
              >
                {glassThickness} мм

                <ChevronDown size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl bg-[#584BF3] p-6 text-white shadow-[0_22px_55px_rgba(99,91,255,0.32)]"
          >
            <div className="absolute -bottom-10 -right-8 h-32 w-32 rotate-45 rounded-3xl bg-white/10" />

            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Результат
            </p>

            <div className="mt-6">
              <p className="text-sm text-white/80">
                Брудний обʼєм
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-black leading-none">
                  {result.grossVolume}
                </span>

                <span className="mb-1 text-base font-bold text-white/80">
                  Л
                </span>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-base font-black text-white">
                Чистий обʼєм
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-5xl font-black leading-none">
                  {result.netVolume}
                </span>

                <span className="mb-1 text-lg font-bold text-white/90">
                  Л
                </span>
              </div>

              <p className="mt-2 text-xs text-white/65">
                З урахуванням скла
              </p>
            </div>

            <div className="mt-7 border-t border-white/20 pt-5">
              <p className="text-sm text-white/80">
                Орієнтовна вага
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl font-black">
                  ~{result.weight}
                </span>

                <span className="mb-1 text-base font-bold text-white/80">
                  Кг
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function CalculatorInput({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg font-black text-slate-950 outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
        />

        <span className="text-base font-black text-slate-500">
          см
        </span>
      </div>
    </div>
  );
}