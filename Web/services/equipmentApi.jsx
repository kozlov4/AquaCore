import { apiJson } from "./apiClient";

function toMaintenanceDays(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

export async function getEquipment(aquariumId, equipmentCategory = "") {
  if (!aquariumId) {
    throw new Error("Не передано id акваріума");
  }

  const params = new URLSearchParams();

  if (equipmentCategory) {
    params.append("equipment_category", equipmentCategory);
  }

  const data = await apiJson(
    `/api/equipment/${aquariumId}${
      params.toString() ? `?${params.toString()}` : ""
    }`,
    {
      method: "GET",
    },
    "Не вдалося завантажити обладнання"
  );

  return Array.isArray(data) ? data : [];
}

export async function addEquipment(aquariumId, values) {
  if (!aquariumId) {
    throw new Error("Не передано id акваріума");
  }

  const payload = {
    category: values.category,
    name: values.name,
    installation_date: values.installation_date,
    specifications: values.specifications || null,
    maintenance_interval_days: toMaintenanceDays(
      values.maintenance_interval_days
    ),
  };

  if (!payload.category) {
    throw new Error("Оберіть категорію обладнання");
  }

  if (!payload.name?.trim()) {
    throw new Error("Введіть бренд та модель обладнання");
  }

  if (!payload.installation_date) {
    throw new Error("Оберіть дату встановлення");
  }

  return apiJson(
    `/api/equipment/${aquariumId}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Не вдалося додати обладнання"
  );
}

export async function serviceEquipment(equipmentId) {
  if (!equipmentId) {
    throw new Error("Не передано id обладнання");
  }

  return apiJson(
    `/api/equipment/${equipmentId}/service`,
    {
      method: "POST",
    },
    "Не вдалося обслужити обладнання"
  );
}