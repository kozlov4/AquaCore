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

function parseOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isNaN(number) ? null : number;
}

function buildWaterTestPayload(payload) {
  return {
    test_date:
      payload.test_date ||
      payload.date ||
      new Date().toISOString().slice(0, 10),

    ph: parseOptionalNumber(payload.ph),
    gh: parseOptionalNumber(payload.gh),
    kh: parseOptionalNumber(payload.kh),
    nh3: parseOptionalNumber(payload.nh3),
    no2: parseOptionalNumber(payload.no2),
    no3: parseOptionalNumber(payload.no3),
  };
}

export async function createWaterTest(aquariumId, payload) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const cleanPayload = buildWaterTestPayload(payload);

  const response = await fetch(
    `/api/tests?aquarium_id=${encodeURIComponent(aquariumId)}`,
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

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити тест води"));
  }

  return data;
}