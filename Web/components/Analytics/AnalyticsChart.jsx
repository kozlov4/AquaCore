"use client";

import { motion } from "framer-motion";

const points = [
  { x: 20, y: 145, label: "1 Квіт" },
  { x: 190, y: 160, label: "8 Квіт" },
  { x: 360, y: 135, label: "15 Квіт" },
  { x: 530, y: 175, label: "22 Квіт" },
  { x: 700, y: 150, label: "Сьогодні" },
];

const path =
  "M20 145 C100 130, 130 165, 190 160 C260 154, 285 130, 360 135 C430 140, 465 165, 530 175 C600 190, 640 175, 700 150";

export function AnalyticsChart() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.14, duration: 0.45, ease: "easeOut" }}
      className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-950">
          Динаміка pH за останній місяць
        </h2>

        <div className="mt-3 flex items-center gap-5 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#635BFF]" />
            Ваші заміри
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-200" />
            Оптимальна зона (6.5 - 7.5)
          </span>
        </div>
      </div>

      <div className="relative h-[300px] overflow-hidden rounded-2xl bg-white">
        <svg
          viewBox="0 0 740 260"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {[40, 80, 120, 160, 200].map((y) => (
            <line
              key={y}
              x1="0"
              x2="740"
              y1={y}
              y2={y}
              stroke="#EEF2F7"
              strokeWidth="1"
            />
          ))}

          <rect x="0" y="105" width="740" height="75" fill="#DCFCE7" opacity="0.65" />

          <motion.path
            d={path}
            fill="none"
            stroke="#635BFF"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />

          {points.map((point, index) => (
            <motion.g
              key={point.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + index * 0.1 }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="9"
                fill={index === 3 ? "#EF4444" : "#635BFF"}
                stroke="white"
                strokeWidth="4"
              />
            </motion.g>
          ))}

          <motion.g
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <rect x="655" y="82" width="56" height="34" rx="8" fill="#111827" />
            <path d="M682 116 L688 124 L694 116" fill="#111827" />
            <text x="666" y="96" fill="white" fontSize="10" fontWeight="700">
              pH: 7.2
            </text>
            <text x="666" y="108" fill="#CBD5E1" fontSize="9">
              Сьогодні
            </text>
          </motion.g>
        </svg>

        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-xs text-slate-400">
          <span>8.5</span>
          <span>8.0</span>
          <span>7.5</span>
          <span>7.0</span>
          <span>6.5</span>
          <span>6.0</span>
        </div>

        <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs text-slate-400">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}