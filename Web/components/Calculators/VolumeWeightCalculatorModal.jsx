"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

export function VolumeWeightCalculatorModal({ onClose }) {
  const [length, setLength] = useState(60);
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(35);
  const [glassThickness, setGlassThickness] = useState(6);

  const result = useMemo(() => {
    const grossVolume = (length * width * height) / 1000;
    const netVolume = grossVolume * 0.93;
    const weight = netVolume + grossVolume * 0.15;

    return {
      grossVolume: grossVolume.toFixed(1),
      netVolume: netVolume.toFixed(1),
      weight: weight.toFixed(1),
    };
  }, [length, width, height, glassThickness]);

  return (
    <CalculatorModalLayout
      icon="📦"
      title="Обʼєм та вага акваріума"
      subtitle="Розрахунок gross/net обʼєму і приблизної ваги"
      iconBg="bg-indigo-50"
      onClose={onClose}
    >
      <div className="grid grid-cols-1 gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_240px]">
        <div className="space-y-5">
          <CalculatorInput label="Довжина акваріума" value={length} onChange={setLength} unit="см" />
          <CalculatorInput label="Ширина акваріума" value={width} onChange={setWidth} unit="см" />
          <CalculatorInput label="Висота акваріума" value={height} onChange={setHeight} unit="см" />
          <CalculatorInput label="Товщина скла" value={glassThickness} onChange={setGlassThickness} unit="мм" />

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Gross = L × W × H / 1000. Net = Gross × 0.93. Вага = Net + Gross × 0.15.
            Товщина скла в цій спрощеній формулі введена для контексту, але не змінює розрахунок.
          </p>
        </div>

        <ResultPanel color="bg-indigo-600" title="Результат">
          <p className="text-sm text-white/80">Чистий обʼєм</p>
          <ResultValue value={result.netVolume} unit="л" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Повний обʼєм</p>
            <ResultValue small value={result.grossVolume} unit="л" />
          </div>

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Приблизна вага</p>
            <ResultValue small value={`~${result.weight}`} unit="кг" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}