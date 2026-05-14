"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

export function LightCalculatorModal({ onClose }) {
  const [volume, setVolume] = useState(60);
  const [type, setType] = useState("Середній травник");

  const multiplier =
    type === "Слабке світло" ? 25 : type === "Сильний травник" ? 60 : 40;

  const lumens = volume * multiplier;
  const watts = Math.round(lumens / 100);

  return (
    <CalculatorModalLayout
      icon="💡"
      title="Потужність освітлення"
      subtitle="Скільки світла потрібно рослинам"
      iconBg="bg-yellow-50"
      onClose={onClose}
    >
      <div
        className="
          grid grid-cols-1 gap-5 px-4 py-5
          sm:px-7 sm:py-7
          lg:grid-cols-[1fr_250px] lg:gap-7
        "
      >
        <div className="space-y-5">
          <CalculatorInput
            label="Чистий обʼєм акваріума"
            value={volume}
            onChange={setVolume}
            unit="л"
          />

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Тип екосистеми
            </label>

            <button
              type="button"
              onClick={() =>
                setType((prev) =>
                  prev === "Середній травник"
                    ? "Сильний травник"
                    : prev === "Сильний травник"
                    ? "Слабке світло"
                    : "Середній травник"
                )
              }
              className="
                flex w-full items-center justify-between
                rounded-2xl border border-slate-300
                px-4 py-3 text-left text-base font-bold
                text-slate-900 transition hover:border-[#FACC15]
              "
            >
              {type}
              <ChevronDown size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <ResultPanel color="bg-yellow-400" dark title="Рекомендовано">
          <p className="text-sm text-yellow-900/80">Світловий потік</p>
          <ResultValue value={lumens} unit="Лм" dark />

          <p className="mt-2 text-xs text-yellow-900/70">
            ~{multiplier} люмен на 1 літр
          </p>

          <div className="mt-6 border-t border-yellow-900/10 pt-5">
            <p className="text-sm text-yellow-900/80">
              Потужність LED-світильника
            </p>

            <ResultValue small value={`~${watts}`} unit="Ватт" dark />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}