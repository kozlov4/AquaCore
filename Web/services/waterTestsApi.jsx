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

function getToken() {
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
  const token = getToken();

  if (!token) {
    throw new Error("Потрібно увійти в акаунт");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return numberValue;
}

export async function createWaterTest(aquariumId, values) {
  if (!aquariumId) {
    throw new Error("Не передано id акваріума");
  }

  const payload = {
    test_date: values.test_date || values.date,
    ph: toNullableNumber(values.ph),
    gh: toNullableNumber(values.gh),
    kh: toNullableNumber(values.kh),
    nh3: toNullableNumber(values.nh3),
    no2: toNullableNumber(values.no2),
    no3: toNullableNumber(values.no3),
  };

  if (!payload.test_date) {
    throw new Error("Вкажіть дату тестування");
  }

  const response = await fetch(
    `/api/tests?aquarium_id=${encodeURIComponent(aquariumId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити тест води"));
  }

  return data;
}