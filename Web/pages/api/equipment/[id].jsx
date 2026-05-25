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

  return Number.isNaN(numberValue) ? null : numberValue;
}

function normalizeEquipmentPayload(body) {
  return {
    category: String(body?.category || "").trim(),
    name: String(body?.name || "").trim(),
    installation_date: body?.installation_date,
    specifications: String(body?.specifications || "").trim() || null,
    maintenance_interval_days: toNullableNumber(body?.maintenance_interval_days),
  };
}

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    if (req.method === "GET") {
      const params = new URLSearchParams();

      if (req.query.equipment_category) {
        params.append("equipment_category", String(req.query.equipment_category));
      }

      const response = await fetch(
        `${API_URL}/equipment/${id}${params.toString() ? `?${params.toString()}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );

      const data = await readResponse(response);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const payload = normalizeEquipmentPayload(req.body);

      if (!payload.category) {
        return res.status(400).json({
          message: "Категорія обладнання є обовʼязковою",
        });
      }

      if (!payload.name) {
        return res.status(400).json({
          message: "Назва обладнання є обовʼязковою",
        });
      }

      if (!payload.installation_date) {
        return res.status(400).json({
          message: "Дата встановлення є обовʼязковою",
        });
      }

      console.log("POST /equipment payload:", payload);

      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        console.error("Backend add equipment error:", data);

        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося додати обладнання"),
          detail: data?.detail,
        });
      }

      return res.status(response.status || 201).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Equipment proxy error:", error);

    return res.status(500).json({
      message: error.message || "Equipment proxy server error",
    });
  }
}