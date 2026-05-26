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

function normalizeAquarium(item) {
  return {
    id: item.id || item.aquarium_id || item.aquariumId,
    name: item.name || item.title || "Акваріум",
  };
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toDateInput(value) {
  if (!value) return new Date().toISOString().slice(0, 10);

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);

  return date.toISOString().slice(0, 10);
}

function normalizeEquipmentLog(item) {
  return {
    id: item.id || `${item.log_date}-${item.log_type}`,
    logType: item.log_type || "Планове обслуговування",
    logDate: item.log_date || "",
    dateLabel: formatDate(item.log_date),
    description: item.description || "",
    isResolved: item.is_resolved !== false,
    raw: item,
  };
}

function normalizeEquipment(item) {
  const logs = Array.isArray(item.logs) ? item.logs.map(normalizeEquipmentLog) : [];

  return {
    id: item.id || item.equipment_id,
    category: item.category || "Інше",
    name: item.name || "Без назви",
    installationDate: item.installation_date || "",
    installationDateLabel: formatDate(item.installation_date),
    specifications: item.specifications || "",
    maintenanceIntervalDays:
      item.maintenance_interval_days === null ||
      item.maintenance_interval_days === undefined
        ? null
        : Number(item.maintenance_interval_days),
    daysUntilMaintenance:
      item.days_until_maintenance === null ||
      item.days_until_maintenance === undefined
        ? null
        : Number(item.days_until_maintenance),
    logs,
    raw: item,
  };
}

function normalizeAlert(data) {
  return {
    needsAttentionCount: Number(data?.needs_attention_count || 0),
    message: data?.message || "",
    equipmentId: data?.equipment_id || null,
    raw: data,
  };
}

function buildEquipmentPayload(payload) {
  return {
    category: payload.category || "Інше",
    name: String(payload.name || "").trim(),
    installation_date: payload.installationDate || payload.installation_date,
    specifications: payload.specifications || null,
    maintenance_interval_days: payload.maintenanceIntervalDays
      ? Number(payload.maintenanceIntervalDays)
      : null,
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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріуми"));
  }

  return Array.isArray(data)
    ? data.map(normalizeAquarium).filter((item) => item.id)
    : [];
}

export async function getEquipmentList(aquariumId, category = "all") {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const params = new URLSearchParams();

  if (category && category !== "all") {
    params.append("equipment_category", category);
  }

  const queryString = params.toString();

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(aquariumId)}${
      queryString ? `?${queryString}` : ""
    }`,
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
    throw new Error(getErrorMessage(data, "Не вдалося завантажити обладнання"));
  }

  return Array.isArray(data) ? data.map(normalizeEquipment) : [];
}

export async function getEquipmentAlertStatus(aquariumId) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(aquariumId)}/alerts/status`,
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
    throw new Error(getErrorMessage(data, "Не вдалося завантажити сповіщення"));
  }

  return normalizeAlert(data);
}

export async function createEquipment(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Оберіть акваріум");
  }

  const response = await fetch(`/api/equipment/${encodeURIComponent(aquariumId)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(buildEquipmentPayload(payload)),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося додати обладнання"));
  }

  return normalizeEquipment(data);
}

export async function updateEquipment(equipmentId, payload) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(`/api/equipment/${encodeURIComponent(equipmentId)}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(buildEquipmentPayload(payload)),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити обладнання"));
  }

  return normalizeEquipment(data);
}

export async function deleteEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(`/api/equipment/${encodeURIComponent(equipmentId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося видалити обладнання"));
  }

  return true;
}

export async function quickServiceEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(equipmentId)}/service`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося обслужити обладнання"));
  }

  return data;
}

export async function addEquipmentLog(equipmentId, payload) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(`/api/equipment/${encodeURIComponent(equipmentId)}/logs`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      log_type: payload.logType || payload.log_type || "Планове обслуговування",
      log_date: payload.logDate || payload.log_date,
      description: payload.description || null,
      is_resolved: Boolean(payload.isResolved ?? payload.is_resolved ?? true),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося зафіксувати проблему"));
  }

  return normalizeEquipmentLog(data);
}