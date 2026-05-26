function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

function authHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Потрібно увійти в акаунт");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function getDateLabel(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });
}

function normalizeAnalyticsPoint(item, metric) {
  const value = toNumber(
    item?.value ??
      item?.y ??
      item?.measurement ??
      item?.[metric] ??
      item?.metric_value
  );

  const date =
    item?.date ||
    item?.test_date ||
    item?.created_at ||
    item?.x ||
    item?.label ||
    "";

  return {
    date,
    label: item?.label || getDateLabel(date),
    value,
    raw: item,
  };
}

function extractPoints(data, metric) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.points)) return data.points;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.values)) return data.values;
  if (Array.isArray(data?.measurements)) return data.measurements;
  if (Array.isArray(data?.tests)) return data.tests;
  if (Array.isArray(data?.history)) return data.history;
  if (Array.isArray(data?.series)) return data.series;

  return [];
}

function calculateStats(points) {
  const values = points
    .map((point) => point.value)
    .filter((value) => typeof value === "number" && Number.isFinite(value));

  if (values.length === 0) {
    return {
      current: null,
      average: null,
      max: null,
      min: null,
      maxDate: "",
      minDate: "",
    };
  }

  const current = values[values.length - 1];
  const sum = values.reduce((acc, value) => acc + value, 0);
  const average = sum / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  const maxPoint = points.find((point) => point.value === max);
  const minPoint = points.find((point) => point.value === min);

  return {
    current,
    average,
    max,
    min,
    maxDate: maxPoint?.label || "",
    minDate: minPoint?.label || "",
  };
}

function normalizeAnalyticsResponse(data, metric) {
  const points = extractPoints(data, metric)
    .map((item) => normalizeAnalyticsPoint(item, metric))
    .filter((point) => point.value !== null);

  const calculatedStats = calculateStats(points);

  return {
    points,
    stats: {
      current: toNumber(data?.current ?? data?.current_value) ?? calculatedStats.current,
      average: toNumber(data?.average ?? data?.avg) ?? calculatedStats.average,
      max: toNumber(data?.max ?? data?.maximum) ?? calculatedStats.max,
      min: toNumber(data?.min ?? data?.minimum) ?? calculatedStats.min,
      maxDate: data?.max_date || calculatedStats.maxDate,
      minDate: data?.min_date || calculatedStats.minDate,
    },
    raw: data,
  };
}

export async function getAquariumNamesForAnalytics() {
  const response = await fetch("/api/aquariums/names", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріуми"));
  }

  return Array.isArray(data)
    ? data
        .map((item) => ({
          id: item.id || item.aquarium_id,
          name: item.name || item.title || "Акваріум",
        }))
        .filter((item) => item.id)
    : [];
}

export async function getWaterAnalytics({ aquariumId, metric, period }) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const params = new URLSearchParams({
    aquarium_id: String(aquariumId),
    metric,
    period,
  });

  const response = await fetch(`/api/tests/analytics?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити аналітику"));
  }

  return normalizeAnalyticsResponse(data, metric);
}

export async function exportWaterTestsCsv(aquariumId) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const params = new URLSearchParams({
    aquarium_id: String(aquariumId),
  });

  const response = await fetch(`/api/tests/export/csv?${params.toString()}`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося експортувати дані"));
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `water-tests-${aquariumId}.csv`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);

  return true;
}