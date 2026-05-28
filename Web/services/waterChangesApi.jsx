function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join("; ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

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
  const match = String(name || "").match(/(\d+(?:[.,]\d+)?)\s*л/i);

  if (!match) return null;

  return Number(String(match[1]).replace(",", "."));
}

function normalizeAquarium(item) {
  const name = item?.name || item?.title || "Акваріум";

  const rawVolume =
    item?.volume ??
    item?.liters ??
    item?.capacity ??
    item?.capacity_liters ??
    item?.aquarium_volume ??
    item?.volume_liters ??
    extractVolumeFromName(name);

  const volumeNumber = Number(rawVolume);

  return {
    id: item?.id || item?.aquarium_id || item?.aquariumId,
    name,
    volume:
      rawVolume !== null &&
      rawVolume !== undefined &&
      rawVolume !== "" &&
      !Number.isNaN(volumeNumber)
        ? volumeNumber
        : null,
    imageUrl:
      item?.image_url ||
      item?.imageUrl ||
      item?.cover_image_url ||
      item?.image?.image_url ||
      "",
    raw: item,
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
    id: item?.id || `${item?.change_date}-${item?.percentage}-${item?.change_type}`,
    changeType: item?.change_type || item?.changeType || "Планова підміна",
    percentage: Number(item?.percentage || 0),
    changeDate: item?.change_date || item?.changeDate || "",
    dateLabel: formatDate(item?.change_date || item?.changeDate),
    comment: item?.comment || "",
    raw: item,
  };
}

function normalizeDashboard(data) {
  const history = Array.isArray(data?.history)
    ? data.history.map(normalizeHistoryItem)
    : [];

  return {
    intervalDays: Number(
      data?.interval_days ||
        data?.intervalDays ||
        data?.water_change_interval_days ||
        0
    ),
    targetPercentage: Number(
      data?.target_percentage ||
        data?.targetPercentage ||
        data?.water_change_percentage ||
        30
    ),
    lastChangeDate: data?.last_change_date || data?.lastChangeDate || null,
    nextChangeDate: data?.next_change_date || data?.nextChangeDate || null,
    daysLeft:
      data?.days_left === null ||
      data?.days_left === undefined ||
      data?.daysLeft === null ||
      data?.daysLeft === undefined
        ? null
        : Number(data?.days_left ?? data?.daysLeft),
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

async function readJson(response) {
  return response.json().catch(() => null);
}

/**
 * Для сторінки підмін потрібен volume.
 * /api/aquariums/names повертає тільки id/name,
 * тому використовуємо /api/aquariums/my-aquariums.
 */
export async function getAquariumNamesForWaterChanges() {
  const response = await fetch("/api/aquariums/my-aquariums", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріуми"));
  }

  return Array.isArray(data)
    ? data.map(normalizeAquarium).filter((item) => item.id)
    : [];
}

/**
 * Додаткова функція для WaterChanges.jsx.
 * Якщо компонент хоче підтягнути повні дані одного акваріума,
 * беремо список my-aquariums і знаходимо потрібний id.
 */
export async function getAquariumForWaterChange(aquariumId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const aquariums = await getAquariumNamesForWaterChanges();

  const aquarium = aquariums.find(
    (item) => String(item.id) === String(aquariumId)
  );

  if (!aquarium) {
    throw new Error("Акваріум не знайдено");
  }

  return aquarium;
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

  const data = await readJson(response);

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

  const data = await readJson(response);

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

  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося оновити параметри підміни")
    );
  }

  return true;
}