"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

const thicknessSteps = [4, 6, 8, 10, 12];

function getBaseThicknessByHeight(height) {
  if (height <= 30) return 4;
  if (height <= 45) return 6;
  if (height <= 60) return 8;
  return 10;
}

function increaseThicknessOneStep(current) {
  const index = thicknessSteps.indexOf(current);

  if (index === -1) return current + 2;

  return thicknessSteps[Math.min(index + 1, thicknessSteps.length - 1)];
}

export function GlassCalculatorModal({ onClose }) {
  const [length, setLength] = useState(100);
  const [height, setHeight] = useState(50);
  const [ribs, setRibs] = useState(true);

  const result = useMemo(() => {
    const baseThickness = getBaseThicknessByHeight(height);
    const recommendedThickness = ribs
      ? baseThickness
      : increaseThicknessOneStep(baseThickness);

    return {
      baseThickness,
      recommendedThickness,
      safetyFactor: ribs ? 3.8 : 3.2,
    };
  }, [length, height, ribs]);

  return (
    <CalculatorModalLayout
      icon="🧊"
      title="Товщина скла"
      subtitle="Базова рекомендація товщини скла за висотою акваріума"
      iconBg="bg-blue-50"
      compact
      onClose={onClose}
    >
      <div className="grid grid-cols-1 gap-7 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <CalculatorInput label="Довжина акваріума" value={length} onChange={setLength} unit="см" />
          <CalculatorInput label="Висота акваріума" value={height} onChange={setHeight} unit="см" />

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40">
            <input
              type="checkbox"
              checked={ribs}
              onChange={(e) => setRibs(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            З ребрами жорсткості
          </label>

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            До 30 см — 4 мм, до 45 см — 6 мм, до 60 см — 8 мм, вище 60 см — 10 мм+.
            Без ребер жорсткості товщина збільшується на один крок.
          </p>
        </div>

        <ResultPanel color="bg-blue-600" title="Вимоги до скла">
          <p className="text-sm text-white/80">Рекомендована товщина</p>
          <ResultValue value={result.recommendedThickness} unit="мм" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Базова товщина</p>
            <ResultValue small value={result.baseThickness} unit="мм" />
          </div>

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Safety Factor</p>
            <ResultValue small value={result.safetyFactor} unit="≈" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}