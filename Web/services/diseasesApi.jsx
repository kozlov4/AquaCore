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

function formatDate(value) {
  if (!value) return "Дата не вказана";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Дата не вказана";

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

function mapEquipmentLogFromApi(log) {
  return {
    id: log.id || log.log_id,
    logType: log.log_type || log.type || "Запис",
    logDate: log.log_date || log.date || "",
    dateLabel: formatDate(log.log_date || log.date),
    description: log.description || "",
    isResolved:
      log.is_resolved === true ||
      log.isResolved === true ||
      log.resolved === true,
    raw: log,
  };
}

export function mapEquipmentFromApi(item) {
  const category = item.category || item.equipment_category || "Інше";
  const name = item.name || item.model || "Без назви";

  return {
    id: item.id || item.equipment_id,
    aquariumId: item.aquarium_id || item.aquariumId || null,

    category,
    name,
    icon: getEquipmentIcon(category, name),

    installationDate: item.installation_date || "",
    installationDateLabel: formatDate(item.installation_date),

    specifications: item.specifications || "",

    maintenanceIntervalDays:
      item.maintenance_interval_days === undefined
        ? null
        : item.maintenance_interval_days,

    daysUntilMaintenance:
      item.days_until_maintenance === undefined
        ? null
        : item.days_until_maintenance,

    logs: Array.isArray(item.logs) ? item.logs.map(mapEquipmentLogFromApi) : [],

    raw: item,
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
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити назви акваріумів")
    );
  }

  return Array.isArray(data)
    ? data.map((item) => ({
        id: item.id || item.aquarium_id,
        name: item.name || "Акваріум",
        raw: item,
      }))
    : [];
}

export async function getEquipmentList(aquariumId, category = "all") {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
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

  console.log("GET EQUIPMENT FRONTEND:", {
    aquariumId,
    category,
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити обладнання"));
  }

  return Array.isArray(data) ? data.map(mapEquipmentFromApi) : [];
}

export async function getEquipmentAlertStatus(aquariumId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
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

  console.log("GET EQUIPMENT ALERT STATUS FRONTEND:", {
    aquariumId,
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити статус обладнання")
    );
  }

  return {
    needsAttentionCount:
      data?.needs_attention_count ?? data?.needsAttentionCount ?? 0,
    message: data?.message || null,
    equipmentId: data?.equipment_id || data?.equipmentId || null,
    raw: data,
  };
}

export async function createEquipment(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const cleanPayload = {
    category: String(payload.category || "").trim(),
    name: String(payload.name || "").trim(),
    installation_date: payload.installationDate || payload.installation_date,
    specifications: payload.specifications
      ? String(payload.specifications).trim()
      : null,
    maintenance_interval_days:
      payload.maintenanceIntervalDays === "" ||
      payload.maintenanceIntervalDays === null ||
      payload.maintenanceIntervalDays === undefined
        ? null
        : Number(payload.maintenanceIntervalDays),
  };

  const response = await fetch(`/api/equipment/${encodeURIComponent(aquariumId)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  console.log("CREATE EQUIPMENT FRONTEND:", {
    aquariumId,
    status: response.status,
    sentPayload: cleanPayload,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося додати обладнання"));
  }

  return mapEquipmentFromApi(data);
}

export async function updateEquipment(equipmentId, payload) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const cleanPayload = {
    category: String(payload.category || "").trim(),
    name: String(payload.name || "").trim(),
    installation_date: payload.installationDate || payload.installation_date,
    specifications: payload.specifications
      ? String(payload.specifications).trim()
      : null,
    maintenance_interval_days:
      payload.maintenanceIntervalDays === "" ||
      payload.maintenanceIntervalDays === null ||
      payload.maintenanceIntervalDays === undefined
        ? null
        : Number(payload.maintenanceIntervalDays),
  };

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(equipmentId)}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(cleanPayload),
    }
  );

  const data = await response.json().catch(() => null);

  console.log("UPDATE EQUIPMENT FRONTEND:", {
    equipmentId,
    status: response.status,
    sentPayload: cleanPayload,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити обладнання"));
  }

  return mapEquipmentFromApi(data);
}

export async function deleteEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(equipmentId)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  if (response.status === 204) {
    return true;
  }

  const data = await response.json().catch(() => null);

  console.log("DELETE EQUIPMENT FRONTEND:", {
    equipmentId,
    status: response.status,
    data,
  });

  if (!response.ok) {
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

  console.log("SERVICE EQUIPMENT FRONTEND:", {
    equipmentId,
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося обслужити обладнання"));
  }

  return data;
}

export async function addEquipmentLog(equipmentId, payload) {
  if (!equipmentId) {
    throw new Error("Equipment id is required");
  }

  const cleanPayload = {
    log_type: String(payload.logType || payload.log_type || "").trim(),
    log_date: payload.logDate || payload.log_date,
    description: payload.description
      ? String(payload.description).trim()
      : null,
    is_resolved: Boolean(payload.isResolved || payload.is_resolved),
  };

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(equipmentId)}/logs`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(cleanPayload),
    }
  );

  const data = await response.json().catch(() => null);

  console.log("ADD EQUIPMENT LOG FRONTEND:", {
    equipmentId,
    status: response.status,
    sentPayload: cleanPayload,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося додати запис"));
  }

  return mapEquipmentLogFromApi(data);
}