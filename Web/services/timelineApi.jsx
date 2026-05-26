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

function formatEventDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const time = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Сьогодні, ${time}`;
  }

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getEventColor(type) {
  const map = {
    "Параметри води": "blue",
    Населення: "violet",
    Обладнання: "gray",
    Обслуговування: "green",
    Алерти: "red",
    Системні: "yellow",
  };

  return map[type] || "gray";
}

function getEventIcon(type) {
  const map = {
    "Параметри води": "💧",
    Населення: "🐟",
    Обладнання: "⚙️",
    Обслуговування: "✅",
    Алерти: "🚨",
    Системні: "⭐",
  };

  return map[type] || "•";
}

function metadataToArray(metadata) {
  if (!metadata || typeof metadata !== "object") return [];

  return Object.entries(metadata)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${key}: ${value}`);
}

function normalizeTimelineEvent(item) {
  const type = item.event_type || item.type || "Системні";
  const metadata = item.event_metadata || item.metadata || null;

  return {
    id: item.id,
    type,
    title: item.title || "Подія",
    text: item.description || item.text || "",
    date: formatEventDate(item.created_at || item.date),
    createdAt: item.created_at || item.date,
    icon: getEventIcon(type),
    color: getEventColor(type),
    data: metadataToArray(metadata),
    raw: item,
  };
}

export async function getAquariumNamesForTimeline() {
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
          id: item.id || item.aquarium_id || item.aquariumId,
          name: item.name || item.title || "Акваріум",
        }))
        .filter((item) => item.id)
    : [];
}

export async function getAquariumTimeline({
  aquariumId,
  types = [],
  dateFrom = "",
  dateTo = "",
  period = "month",
}) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const params = new URLSearchParams();

  if (period) {
    params.append("period", period);
  }

  if (dateFrom) {
    params.append("date_from", dateFrom);
  }

  if (dateTo) {
    params.append("date_to", dateTo);
  }

  types.forEach((type) => {
    if (type) {
      params.append("types", type);
    }
  });

  const response = await fetch(
    `/api/aquariums/${encodeURIComponent(aquariumId)}/timeline?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити хронологію"));
  }

  return Array.isArray(data) ? data.map(normalizeTimelineEvent) : [];
}