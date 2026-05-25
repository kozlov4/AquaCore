function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallbackMessage;
}

function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

function authHeaders() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Потрібно увійти в акаунт");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function toOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? undefined : numberValue;
}

function buildEquipmentPayload(values) {
  const payload = {
    category: String(values.category || "").trim(),
    name: String(values.name || "").trim(),
    installation_date: values.installation_date,
  };

  const specifications = String(values.specifications || "").trim();
  const maintenanceIntervalDays = toOptionalNumber(
    values.maintenance_interval_days
  );

  if (specifications) {
    payload.specifications = specifications;
  }

  if (maintenanceIntervalDays !== undefined) {
    payload.maintenance_interval_days = maintenanceIntervalDays;
  }

  return payload;
}

export async function getEquipment(aquariumId, equipmentCategory = "") {
  if (!aquariumId) {
    throw new Error("Не передано id акваріума");
  }

  const params = new URLSearchParams();

  if (equipmentCategory) {
    params.append("equipment_category", equipmentCategory);
  }

  const response = await fetch(
    `/api/equipment/${encodeURIComponent(aquariumId)}${
      params.toString() ? `?${params.toString()}` : ""
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

  return Array.isArray(data) ? data : [];
}

export async function addEquipment(aquariumId, values) {
  if (!aquariumId) {
    throw new Error("Не передано id акваріума");
  }

  const payload = buildEquipmentPayload(values);

  if (!payload.category) {
    throw new Error("Оберіть категорію обладнання");
  }

  if (!payload.name) {
    throw new Error("Введіть бренд та модель обладнання");
  }

  if (!payload.installation_date) {
    throw new Error("Оберіть дату встановлення");
  }

  const response = await fetch(`/api/equipment/${encodeURIComponent(aquariumId)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    /*
      Тимчасовий захист від бекенд-багу:
      бекенд створює обладнання, але після цього повертає 500.
      Тому при 500 перевіряємо список обладнання повторно.
    */
    if (response.status === 500) {
      const equipmentAfterFailedPost = await getEquipment(aquariumId);

      const createdItem = equipmentAfterFailedPost.find((item) => {
        const sameName =
          String(item.name || "").trim().toLowerCase() ===
          payload.name.toLowerCase();

        const sameCategory =
          String(item.category || "").trim().toLowerCase() ===
          payload.category.toLowerCase();

        return sameName && sameCategory;
      });

      if (createdItem) {
        return createdItem;
      }
    }

    throw new Error(getErrorMessage(data, "Не вдалося додати обладнання"));
  }

  return data;
}

export async function serviceEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Не передано id обладнання");
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

  if (response.status === 204) {
    return {};
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося обслужити обладнання"));
  }

  return data;
}