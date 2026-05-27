function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join("; ");
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

function formatEquipmentDate(value) {
  if (!value) return "Дата не вказана";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Дата не вказана";
    }

    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "Дата не вказана";
  }
}

function getEquipmentIcon(category, name) {
  const value = `${category || ""} ${name || ""}`.toLowerCase();

  if (
    value.includes("фільтр") ||
    value.includes("фильтр") ||
    value.includes("filter") ||
    value.includes("filtration")
  ) {
    return "⚙️";
  }

  if (
    value.includes("світ") ||
    value.includes("свет") ||
    value.includes("light") ||
    value.includes("lamp") ||
    value.includes("led") ||
    value.includes("chihiros")
  ) {
    return "💡";
  }

  if (
    value.includes("обігр") ||
    value.includes("нагрев") ||
    value.includes("heater") ||
    value.includes("heating")
  ) {
    return "🌡️";
  }

  if (
    value.includes("co2") ||
    value.includes("co₂") ||
    value.includes("вугле") ||
    value.includes("угле")
  ) {
    return "🫧";
  }

  if (
    value.includes("компрес") ||
    value.includes("aerator") ||
    value.includes("air") ||
    value.includes("аера")
  ) {
    return "💨";
  }

  return "🔧";
}

function formatMaintenanceInterval(days) {
  if (!days) return "Інтервал не задано";

  const value = Number(days);

  if (value === 1) return "кожен день";
  if (value > 1 && value < 5) return `кожні ${value} дні`;

  return `кожні ${value} днів`;
}

export function mapEquipmentFromApi(item) {
  const category = item.category || item.equipment_category || "Інше";
  const name = item.name || item.model || "Без назви";

  return {
    id: item.id || item.equipment_id,
    category,
    name,
    icon: getEquipmentIcon(category, name),

    installationDate: item.installation_date || "",
    installationDateFormatted: formatEquipmentDate(item.installation_date),

    specifications: item.specifications || "",
    maintenanceIntervalDays: item.maintenance_interval_days || null,
    maintenanceIntervalText: formatMaintenanceInterval(
      item.maintenance_interval_days
    ),

    daysUntilMaintenance: item.days_until_maintenance,
    logs: Array.isArray(item.logs) ? item.logs : [],

    desc: item.specifications || "Характеристики не вказані",
    raw: item,
  };
}

export async function getAquariumEquipment(aquariumId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const response = await fetch(`/api/equipment/${aquariumId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити обладнання"));
  }

  return Array.isArray(data) ? data.map(mapEquipmentFromApi) : [];
}

export async function addEquipmentToAquarium(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const cleanPayload = {
    category: String(payload.category || "").trim(),
    name: String(payload.name || "").trim(),
    installation_date: payload.installation_date,
    specifications: payload.specifications
      ? String(payload.specifications).trim()
      : null,
    maintenance_interval_days:
      payload.maintenance_interval_days === null ||
      payload.maintenance_interval_days === undefined ||
      payload.maintenance_interval_days === ""
        ? null
        : Number(payload.maintenance_interval_days),
  };

  const response = await fetch(`/api/equipment/${aquariumId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  console.log("ADD EQUIPMENT FRONTEND:", {
    status: response.status,
    data,
    sentPayload: cleanPayload,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося додати обладнання"));
  }

  return mapEquipmentFromApi(data);
}

export async function serviceEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(`/api/equipment/${equipmentId}/service`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  console.log("SERVICE EQUIPMENT FRONTEND:", {
    status: response.status,
    data,
    equipmentId,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося обслужити обладнання"));
  }

  return data;
}