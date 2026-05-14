"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

export function GroundCalculatorModal({ onClose }) {
  const [length, setLength] = useState(60);
  const [width, setWidth] = useState(30);
  const [depth, setDepth] = useState(5);

  const result = useMemo(() => {
    const liters = (length * width * depth) / 1000;
    const weight = liters * 1.5;

    return {
      liters: liters.toFixed(1),
      weight: weight.toFixed(1),
    };
  }, [length, width, depth]);

  return (
    <CalculatorModalLayout
      icon="🪨"
      title="Кількість ґрунту"
      subtitle="Розрахунок обʼєму та приблизної ваги субстрату"
      iconBg="bg-orange-50"
      onClose={onClose}
    >
      <div className="grid grid-cols-1 gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <CalculatorInput label="Довжина дна" value={length} onChange={setLength} unit="см" />
          <CalculatorInput label="Ширина дна" value={width} onChange={setWidth} unit="см" />
          <CalculatorInput label="Бажана товщина ґрунту" value={depth} onChange={setDepth} unit="см" />

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Обʼєм = L × W × D / 1000. Вага = Обʼєм × 1.5.
          </p>
        </div>

        <ResultPanel color="bg-orange-500" title="Вам знадобиться">
          <p className="text-sm text-white/80">Обʼєм ґрунту</p>
          <ResultValue value={result.liters} unit="л" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Приблизна вага</p>
            <ResultValue small value={`~${result.weight}`} unit="кг" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}