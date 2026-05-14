"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

export function Co2CalculatorModal({ onClose }) {
  const [ph, setPh] = useState(6.8);
  const [kh, setKh] = useState(5);

  const co2 = useMemo(() => {
    return Math.round(3 * kh * Math.pow(10, 7 - ph));
  }, [ph, kh]);

  return (
    <CalculatorModalLayout
      icon="🧪"
      title="Концентрація CO2"
      subtitle="Залежність pH від карбонатної жорсткості"
      iconBg="bg-emerald-50"
      compact
      onClose={onClose}
    >
      <div
        className="
          grid grid-cols-1 gap-5 px-4 py-5
          sm:px-6 sm:py-6
          lg:grid-cols-[1fr_190px] lg:gap-7
        "
      >
        <div className="space-y-5">
          <CalculatorInput
            label="Рівень кислотності (pH)"
            value={ph}
            onChange={setPh}
            unit=""
          />

          <CalculatorInput
            label="Карбонатна жорсткість (kH)"
            value={kh}
            onChange={setKh}
            unit="°dKH"
          />

          <p className="text-xs leading-5 text-slate-400">
            Формула: 3 × kH × 10^(7 - pH)
          </p>
        </div>

        <ResultPanel color="bg-cyan-600" title="Результат">
          <p className="text-sm text-white/80">Рівень CO2 у воді</p>
          <ResultValue value={co2} unit="мг/л" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Статус для рослин</p>

            <span className="mt-2 inline-flex rounded-md bg-white px-3 py-1 text-xs font-black text-cyan-700">
              Оптимально
            </span>
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}