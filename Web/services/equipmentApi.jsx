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

async function readJsonResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Empty response",
    };
  }
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

  return "⚙️";
}

function formatMaintenanceInterval(days) {
  if (!days) return "Інтервал не задано";

  const value = Number(days);

  if (value === 1) return "кожен день";
  if (value > 1 && value < 5) return `кожні ${value} дні`;

  return `кожні ${value} днів`;
}

function mapEquipmentLogFromApi(log = {}) {
  return {
    id: log.id,
    logType: log.log_type || log.logType || "Запис",
    log_type: log.log_type || log.logType || "Запис",
    logDate: log.log_date || log.logDate || "",
    log_date: log.log_date || log.logDate || "",
    dateLabel: formatEquipmentDate(log.log_date || log.logDate),
    description: log.description || "",
    isResolved: Boolean(log.is_resolved ?? log.isResolved),
    is_resolved: Boolean(log.is_resolved ?? log.isResolved),
    raw: log,
  };
}

export function mapEquipmentFromApi(item = {}) {
  const category = item.category || item.equipment_category || "Інше";
  const name = item.name || item.model || "Без назви";
  const installationDate = item.installation_date || item.installationDate || "";

  return {
    id: item.id || item.equipment_id,
    equipmentId: item.id || item.equipment_id,

    category,
    name,
    icon: getEquipmentIcon(category, name),

    installationDate,
    installation_date: installationDate,
    installationDateLabel: formatEquipmentDate(installationDate),
    installationDateFormatted: formatEquipmentDate(installationDate),

    specifications: item.specifications || "",

    maintenanceIntervalDays:
      item.maintenance_interval_days ?? item.maintenanceIntervalDays ?? null,
    maintenance_interval_days:
      item.maintenance_interval_days ?? item.maintenanceIntervalDays ?? null,
    maintenanceIntervalText: formatMaintenanceInterval(
      item.maintenance_interval_days ?? item.maintenanceIntervalDays
    ),

    daysUntilMaintenance:
      item.days_until_maintenance ?? item.daysUntilMaintenance ?? null,
    days_until_maintenance:
      item.days_until_maintenance ?? item.daysUntilMaintenance ?? null,

    logs: Array.isArray(item.logs) ? item.logs.map(mapEquipmentLogFromApi) : [],

    desc: item.specifications || "Характеристики не вказані",
    raw: item,
  };
}

export function mapAquariumNameFromApi(item = {}) {
  return {
    id: item.id || item.aquarium_id || item.aquariumId,
    name: item.name || item.title || "Акваріум",
    volume: item.volume || null,
    raw: item,
  };
}

export function mapAlertStatusFromApi(data = {}) {
  return {
    needsAttentionCount:
      data.needs_attention_count ?? data.needsAttentionCount ?? 0,
    needs_attention_count:
      data.needs_attention_count ?? data.needsAttentionCount ?? 0,
    message: data.message || null,
    equipmentId: data.equipment_id ?? data.equipmentId ?? null,
    equipment_id: data.equipment_id ?? data.equipmentId ?? null,
    raw: data,
  };
}

export async function getAquariumNamesForEquipment() {
  const response = await fetch("/api/aquariums/names", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити список акваріумів")
    );
  }

  return Array.isArray(data) ? data.map(mapAquariumNameFromApi) : [];
}

export async function getEquipmentList(aquariumId, selectedCategory = "all") {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const params = new URLSearchParams();

  if (selectedCategory && selectedCategory !== "all") {
    params.append("equipment_category", selectedCategory);
  }

  const query = params.toString();

  const response = await fetch(
    `/api/equipment/${aquariumId}${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити обладнання")
    );
  }

  return Array.isArray(data) ? data.map(mapEquipmentFromApi) : [];
}

export async function getEquipmentAlertStatus(aquariumId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const response = await fetch(`/api/equipment/${aquariumId}/alerts/status`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити статус обладнання")
    );
  }

  return mapAlertStatusFromApi(data);
}

function normalizeEquipmentPayload(payload = {}) {
  return {
    category: String(payload.category || "").trim(),
    name: String(payload.name || "").trim(),
    installation_date:
      payload.installation_date || payload.installationDate || null,
    specifications: payload.specifications
      ? String(payload.specifications).trim()
      : null,
    maintenance_interval_days:
      payload.maintenance_interval_days === "" ||
      payload.maintenance_interval_days === null ||
      payload.maintenance_interval_days === undefined
        ? payload.maintenanceIntervalDays === "" ||
          payload.maintenanceIntervalDays === null ||
          payload.maintenanceIntervalDays === undefined
          ? null
          : Number(payload.maintenanceIntervalDays)
        : Number(payload.maintenance_interval_days),
  };
}

export async function createEquipment(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const cleanPayload = normalizeEquipmentPayload(payload);

  const response = await fetch(`/api/equipment/${aquariumId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося додати обладнання"));
  }

  return mapEquipmentFromApi(data);
}

export async function updateEquipment(equipmentId, payload) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const cleanPayload = normalizeEquipmentPayload(payload);

  const response = await fetch(`/api/equipment/${equipmentId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити обладнання"));
  }

  return mapEquipmentFromApi(data);
}

export async function deleteEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(`/api/equipment/${equipmentId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося видалити обладнання"));
  }

  return data;
}

export async function quickServiceEquipment(equipmentId) {
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

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося обслужити обладнання"));
  }

  return data;
}

export async function addEquipmentLog(equipmentId, payload = {}) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const cleanPayload = {
    log_type: String(payload.log_type || payload.logType || "").trim(),
    log_date: payload.log_date || payload.logDate || null,
    description: payload.description
      ? String(payload.description).trim()
      : null,
    is_resolved: Boolean(payload.is_resolved ?? payload.isResolved),
  };

  const response = await fetch(`/api/equipment/${equipmentId}/logs`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося додати запис"));
  }

  return mapEquipmentLogFromApi(data);
}

/*
  Старі назви залишив як alias, щоб не ламати інші частини проєкту,
  якщо вони десь ще використовуються.
*/
export const getAquariumEquipment = getEquipmentList;
export const addEquipmentToAquarium = createEquipment;
export const serviceEquipment = quickServiceEquipment;