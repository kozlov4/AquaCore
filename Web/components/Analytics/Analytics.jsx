"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Sidebar } from "../Profile/Sidebar";
import {
  exportWaterTestsCsv,
  getAquariumNamesForAnalytics,
  getWaterAnalytics,
} from "../../services/analyticsApi";

const metrics = [
  {
    key: "ph",
    label: "Кислотність (pH)",
    title: "Динаміка pH",
    unit: "pH",
    optimalMin: 6.5,
    optimalMax: 7.5,
  },
  {
    key: "gh",
    label: "Жорсткість (GH)",
    title: "Динаміка GH",
    unit: "GH",
    optimalMin: 4,
    optimalMax: 12,
  },
  {
    key: "kh",
    label: "KH",
    title: "Динаміка KH",
    unit: "KH",
    optimalMin: 3,
    optimalMax: 8,
  },
  {
    key: "nh3",
    label: "Аміак (NH3)",
    title: "Динаміка NH3",
    unit: "NH3",
    optimalMin: 0,
    optimalMax: 0.25,
  },
  {
    key: "no2",
    label: "Нітрити (NO2)",
    title: "Динаміка NO2",
    unit: "NO2",
    optimalMin: 0,
    optimalMax: 0.2,
  },
  {
    key: "no3",
    label: "Нітрати (NO3)",
    title: "Динаміка NO3",
    unit: "NO3",
    optimalMin: 0,
    optimalMax: 40,
  },
];

const periods = [
  {
    key: "7d",
    label: "7 Днів",
    title: "за останні 7 днів",
  },
  {
    key: "month",
    label: "Місяць",
    title: "за останній місяць",
  },
  {
    key: "year",
    label: "Рік",
    title: "за останній рік",
  },
];

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  const number = Number(value);

  if (Math.abs(number) < 1 && number !== 0) {
    return number.toFixed(2);
  }

  return number.toFixed(1);
}

function buildChart(points, metricConfig) {
  const width = 760;
  const height = 260;
  const padding = {
    top: 24,
    right: 24,
    bottom: 36,
    left: 46,
  };

  const values = points
    .map((point) => point.value)
    .filter((value) => typeof value === "number" && Number.isFinite(value));

  const optimalMin = metricConfig.optimalMin;
  const optimalMax = metricConfig.optimalMax;

  const allValues = [...values, optimalMin, optimalMax];

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const range = maxValue - minValue || 1;
  const visualMin = minValue - range * 0.18;
  const visualMax = maxValue + range * 0.18;
  const visualRange = visualMax - visualMin || 1;

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getX = (index) => {
    if (points.length <= 1) return padding.left + innerWidth / 2;

    return padding.left + (index / (points.length - 1)) * innerWidth;
  };

  const getY = (value) => {
    return padding.top + ((visualMax - value) / visualRange) * innerHeight;
  };

  const linePoints = points.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(point.value),
  }));

  const path = linePoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const optimalTop = getY(optimalMax);
  const optimalBottom = getY(optimalMin);

  const ticks = Array.from({ length: 5 }).map((_, index) => {
    const value = visualMax - (index / 4) * visualRange;

    return {
      value,
      y: getY(value),
    };
  });

  return {
    width,
    height,
    path,
    linePoints,
    optimalTop,
    optimalBottom,
    optimalHeight: Math.max(0, optimalBottom - optimalTop),
    ticks,
  };
}

function AnalyticsChart({ points, metricConfig, periodConfig }) {
  const chart = useMemo(
    () => buildChart(points, metricConfig),
    [points, metricConfig]
  );

  return (
    <section className="rounded-[18px] border border-[#edf0f5] bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
      <div className="mb-5">
        <h2 className="text-[16px] font-extrabold text-[#111827]">
          {metricConfig.title} {periodConfig.title}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] font-bold text-[#98a2b3]">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#635bff]" />
            Ваші заміри
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
            Оптимальна зона ({metricConfig.optimalMin} - {metricConfig.optimalMax})
          </span>
        </div>
      </div>

      {points.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center rounded-2xl bg-[#fbfcfe] text-center">
          <div>
            <p className="text-[16px] font-black text-[#111827]">
              Даних для графіка поки немає
            </p>
            <p className="mt-2 text-[13px] font-semibold text-[#98a2b3]">
              Додайте тести води для обраного акваріума.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="min-h-[260px] w-full min-w-[720px]"
            role="img"
          >
            {chart.ticks.map((tick) => (
              <g key={tick.y}>
                <line
                  x1="46"
                  x2="736"
                  y1={tick.y}
                  y2={tick.y}
                  stroke="#eef2f7"
                  strokeWidth="1"
                />
                <text
                  x="4"
                  y={tick.y + 4}
                  fill="#98a2b3"
                  fontSize="11"
                  fontWeight="700"
                >
                  {formatNumber(tick.value)}
                </text>
              </g>
            ))}

            <rect
              x="46"
              y={chart.optimalTop}
              width="690"
              height={chart.optimalHeight}
              rx="8"
              fill="#dcfce7"
              opacity="0.7"
            />

            <path
              d={chart.path}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.linePoints.map((point, index) => {
              const isOutside =
                point.value < metricConfig.optimalMin ||
                point.value > metricConfig.optimalMax;

              return (
                <g key={`${point.date}-${index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill={isOutside ? "#ef4444" : "#635bff"}
                    stroke="white"
                    strokeWidth="3"
                  />

                  <text
                    x={point.x}
                    y="246"
                    textAnchor="middle"
                    fill="#98a2b3"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </section>
  );
}

function StatCard({ title, value, description, type }) {
  const danger = type === "danger";
  const success = type === "success";

  return (
    <div
      className={`
        rounded-[16px] border bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]
        ${danger ? "border-l-4 border-l-red-500" : "border-[#edf0f5]"}
      `}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.04em] text-[#98a2b3]">
        {title}
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-[26px] font-black leading-none text-[#111827]">
          {value}
        </span>

        <span
          className={`
            text-[12px] font-extrabold
            ${danger ? "text-red-500" : success ? "text-emerald-500" : "text-[#98a2b3]"}
          `}
        >
          {description}
        </span>
      </div>
    </div>
  );
}

export function Analytics() {
  const [aquariums, setAquariums] = useState([]);
  const [selectedAquariumId, setSelectedAquariumId] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("ph");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [analytics, setAnalytics] = useState({
    points: [],
    stats: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const selectedMetricConfig = useMemo(() => {
    return metrics.find((metric) => metric.key === selectedMetric) || metrics[0];
  }, [selectedMetric]);

  const selectedPeriodConfig = useMemo(() => {
    return periods.find((period) => period.key === selectedPeriod) || periods[1];
  }, [selectedPeriod]);

  useEffect(() => {
    async function loadAquariums() {
      try {
        setError("");

        const data = await getAquariumNamesForAnalytics();

        setAquariums(data);

        if (data.length > 0) {
          setSelectedAquariumId(String(data[0].id));
        }
      } catch (error) {
        setError(error.message || "Не вдалося завантажити акваріуми");
      }
    }

    loadAquariums();
  }, []);

  useEffect(() => {
    async function loadAnalytics() {
      if (!selectedAquariumId) return;

      try {
        setIsLoading(true);
        setError("");

        const data = await getWaterAnalytics({
          aquariumId: selectedAquariumId,
          metric: selectedMetric,
          period: selectedPeriod,
        });

        setAnalytics(data);
      } catch (error) {
        setAnalytics({
          points: [],
          stats: {},
        });
        setError(error.message || "Не вдалося завантажити аналітику");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedAquariumId, selectedMetric, selectedPeriod]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError("");

      await exportWaterTestsCsv(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося експортувати дані");
    } finally {
      setIsExporting(false);
    }
  };

  const stats = analytics.stats || {};
  const current = stats.current;
  const isCurrentNormal =
    typeof current === "number" &&
    current >= selectedMetricConfig.optimalMin &&
    current <= selectedMetricConfig.optimalMax;

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1030px]">
          <header className="mb-7 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#111827]">
                Аналітика показників
              </h1>

              <p className="mt-2 text-[13px] font-medium text-[#98a2b3]">
                Відслідковуйте стабільність параметрів у часі
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={!selectedAquariumId || isExporting}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#edf0f5] bg-white px-5 text-[13px] font-extrabold text-[#475467] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Експорт даних
            </button>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          <div className="mb-5 rounded-[18px] border border-[#edf0f5] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedAquariumId}
                onChange={(event) => setSelectedAquariumId(event.target.value)}
                className="h-10 min-w-[220px] rounded-xl border border-[#e3e9f2] bg-[#fbfcfe] px-4 text-[13px] font-extrabold text-[#475467] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
              >
                {aquariums.length === 0 ? (
                  <option value="">Акваріуми відсутні</option>
                ) : (
                  aquariums.map((aquarium) => (
                    <option key={aquarium.id} value={aquarium.id}>
                      🐟 {aquarium.name}
                    </option>
                  ))
                )}
              </select>

              <div className="flex flex-wrap gap-2">
                {metrics.map((metric) => (
                  <button
                    key={metric.key}
                    type="button"
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`
                      h-10 rounded-xl px-4 text-[13px] font-extrabold transition
                      ${
                        selectedMetric === metric.key
                          ? "bg-[#635bff] text-white shadow-[0_10px_24px_rgba(99,91,255,0.22)]"
                          : "bg-white text-[#475467] hover:bg-[#f4f6fb]"
                      }
                    `}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex rounded-xl bg-[#f4f6fb] p-1">
                {periods.map((period) => (
                  <button
                    key={period.key}
                    type="button"
                    onClick={() => setSelectedPeriod(period.key)}
                    className={`
                      h-8 rounded-lg px-3 text-[12px] font-extrabold transition
                      ${
                        selectedPeriod === period.key
                          ? "bg-white text-[#111827] shadow-sm"
                          : "text-[#98a2b3] hover:text-[#475467]"
                      }
                    `}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-[360px] items-center justify-center rounded-[18px] border border-[#edf0f5] bg-[#fbfcfe]">
              <div className="flex items-center gap-3 text-[14px] font-bold text-[#98a2b3]">
                <Loader2 size={20} className="animate-spin" />
                Завантаження графіка...
              </div>
            </div>
          ) : (
            <AnalyticsChart
              points={analytics.points || []}
              metricConfig={selectedMetricConfig}
              periodConfig={selectedPeriodConfig}
            />
          )}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Поточний стан"
              value={formatNumber(stats.current)}
              description={isCurrentNormal ? "✓ В нормі" : "поза нормою"}
              type={isCurrentNormal ? "success" : "danger"}
            />

            <StatCard
              title="Середнє значення"
              value={formatNumber(stats.average)}
              description={selectedPeriodConfig.title.replace("за ", "")}
              type="default"
            />

            <StatCard
              title="Максимум / Стрибок"
              value={formatNumber(stats.max)}
              description={stats.maxDate || "—"}
              type="danger"
            />

            <StatCard
              title="Мінімум"
              value={formatNumber(stats.min)}
              description={stats.minDate || "—"}
              type="default"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Analytics;