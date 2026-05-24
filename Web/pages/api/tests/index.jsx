const API_URL = "https://aquacore.onrender.com";

async function readResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Empty response from backend",
    };
  }
}

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

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const token = req.headers.authorization;
    const { aquarium_id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!aquarium_id) {
      return res.status(400).json({
        message: "Aquarium id is required",
      });
    }

    const payload = {
      test_date: req.body?.test_date || req.body?.date,
      ph: toNullableNumber(req.body?.ph),
      gh: toNullableNumber(req.body?.gh),
      kh: toNullableNumber(req.body?.kh),
      nh3: toNullableNumber(req.body?.nh3),
      no2: toNullableNumber(req.body?.no2),
      no3: toNullableNumber(req.body?.no3),
    };

    if (!payload.test_date) {
      return res.status(400).json({
        message: "Test date is required",
      });
    }

    const response = await fetch(
      `${API_URL}/tests?aquarium_id=${encodeURIComponent(aquarium_id)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося створити тест води"),
        detail: data?.detail,
      });
    }

    return res.status(response.status || 201).json(data);
  } catch (error) {
    console.error("Create water test proxy error:", error);

    return res.status(500).json({
      message: error.message || "Create water test proxy server error",
    });
  }
}