"use client";

import { useMemo, useState } from "react";
import { CalculatorModalLayout, CalculatorInput, ResultPanel, ResultValue } from "./calculatorModalUi";

export function GlassCalculatorModal({ onClose }) {
  const [length, setLength] = useState(100);
  const [height, setHeight] = useState(50);
  const [ribs, setRibs] = useState(true);

  const thickness = useMemo(() => {
    const base = height <= 40 ? 6 : height <= 55 ? 8 : 10;
    return ribs ? base : base + 2;
  }, [height, ribs]);

  const safety = ribs ? 3.8 : 2.9;

  return (
    <CalculatorModalLayout
      icon="🧊"
      title="Товщина скла"
      subtitle="Безпечний розрахунок для склейки"
      iconBg="bg-blue-50"
      compact
      onClose={onClose}
    >
      <div className="grid grid-cols-[1fr_220px] gap-7 px-6 py-6">
        <div className="space-y-5">
          <CalculatorInput label="Довжина акваріума" value={length} onChange={setLength} unit="см" />
          <CalculatorInput label="Висота акваріума" value={height} onChange={setHeight} unit="см" />

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={ribs}
              onChange={(e) => setRibs(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            З ребрами жорсткості
          </label>
        </div>

        <ResultPanel color="bg-blue-600" title="Вимоги до скла">
          <p className="text-sm text-white/80">Мінімальна товщина</p>
          <ResultValue value={thickness} unit="мм" />
          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Запас міцності</p>
            <ResultValue small value={safety} unit="Безпечно" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}