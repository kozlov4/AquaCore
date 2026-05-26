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

function extractVolumeFromName(name) {
  const match = String(name || "").match(/\((\d+(?:[.,]\d+)?)\s*л/i);

  if (!match) return null;

  return Number(String(match[1]).replace(",", "."));
}

function normalizeAquarium(item) {
  const name = item.name || item.title || "Акваріум";

  return {
    id: item.id || item.aquarium_id || item.aquariumId,
    name,
    volume:
      item.volume ||
      item.liters ||
      item.capacity ||
      item.capacity_liters ||
      extractVolumeFromName(name),
  };
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
}

function getTodayInput() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeHistoryItem(item) {
  return {
    id: item.id || `${item.change_date}-${item.percentage}-${item.change_type}`,
    changeType: item.change_type || "Планова підміна",
    percentage: Number(item.percentage || 0),
    changeDate: item.change_date || "",
    dateLabel: formatDate(item.change_date),
    comment: item.comment || "",
    raw: item,
  };
}

function normalizeDashboard(data) {
  const history = Array.isArray(data?.history)
    ? data.history.map(normalizeHistoryItem)
    : [];

  return {
    intervalDays: Number(data?.interval_days || 0),
    targetPercentage: Number(data?.target_percentage || 0),
    lastChangeDate: data?.last_change_date || null,
    nextChangeDate: data?.next_change_date || null,
    daysLeft:
      data?.days_left === null || data?.days_left === undefined
        ? null
        : Number(data.days_left),
    history,
    raw: data,
  };
}

function toApiChangeType(value) {
  const map = {
    planned: "Планова підміна",
    emergency: "Екстрена підміна",
    "Планова підміна": "Планова підміна",
    "Екстрена підміна": "Екстрена підміна",
  };

  return map[value] || "Планова підміна";
}

export async function getAquariumNamesForWaterChanges() {
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
    ? data.map(normalizeAquarium).filter((item) => item.id)
    : [];
}

export async function getWaterChangeDashboard(aquariumId) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const response = await fetch(
    `/api/water-changes/${encodeURIComponent(aquariumId)}`,
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
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити графік підмін")
    );
  }

  return normalizeDashboard(data);
}

export async function recordWaterChange(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const response = await fetch(
    `/api/water-changes/${encodeURIComponent(aquariumId)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        change_type: toApiChangeType(payload.changeType || payload.change_type),
        percentage: Number(payload.percentage),
        change_date: payload.changeDate || payload.change_date || getTodayInput(),
        comment: payload.comment || null,
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося зафіксувати підміну"));
  }

  return normalizeHistoryItem(data);
}

export async function updateWaterChangeSchedule(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const response = await fetch(
    `/api/water-changes/${encodeURIComponent(aquariumId)}/schedule`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        water_change_interval_days: Number(payload.intervalDays),
        water_change_percentage: Number(payload.percentage),
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося оновити параметри підміни")
    );
  }

  return true;
}