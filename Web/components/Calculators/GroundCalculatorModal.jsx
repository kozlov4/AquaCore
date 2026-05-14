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
  const [thickness, setThickness] = useState(5);

  const result = useMemo(() => {
    const liters = (length * width * thickness) / 1000;
    const weight = liters * 1.5;

    return {
      liters: liters.toFixed(1),
      weight: weight.toFixed(1),
    };
  }, [length, width, thickness]);

  return (
    <CalculatorModalLayout
      icon="🪨"
      title="Кількість ґрунту"
      subtitle="Для створення ідеального шару"
      iconBg="bg-orange-50"
      onClose={onClose}
    >
      <div
        className="
          grid grid-cols-1 gap-5 px-4 py-5
          sm:px-7 sm:py-7
          lg:grid-cols-[1fr_220px] lg:gap-7
        "
      >
        <div className="space-y-5">
          <CalculatorInput
            label="Довжина дна"
            value={length}
            onChange={setLength}
          />

          <CalculatorInput
            label="Глибина дна (Ширина)"
            value={width}
            onChange={setWidth}
          />

          <CalculatorInput
            label="Бажана товщина ґрунту"
            value={thickness}
            onChange={setThickness}
          />
        </div>

        <ResultPanel color="bg-orange-500" title="Вам знадобиться">
          <p className="text-sm text-white/80">Обʼєм ґрунту</p>

          <ResultValue value={result.liters} unit="Літрів" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Приблизна вага</p>

            <ResultValue small value={`~${result.weight}`} unit="Кг" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}