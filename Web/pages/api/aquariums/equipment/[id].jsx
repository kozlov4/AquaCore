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
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join("; ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization;
    const { id, equipment_category } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Aquarium id is required",
      });
    }

    if (req.method === "GET") {
      const query = equipment_category
        ? `?equipment_category=${encodeURIComponent(equipment_category)}`
        : "";

      const response = await fetch(`${API_URL}/equipment/${id}${query}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log(`GET /equipment/${id} status:`, response.status);
      console.log(`GET /equipment/${id} response:`, data);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося завантажити обладнання"),
          detail: data?.detail,
          backendStatus: response.status,
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const body = req.body || {};

      const payload = {
        category: String(body.category || "").trim(),
        name: String(body.name || "").trim(),
        installation_date: body.installation_date,
        specifications: body.specifications
          ? String(body.specifications).trim()
          : null,
        maintenance_interval_days:
          body.maintenance_interval_days === null ||
          body.maintenance_interval_days === undefined ||
          body.maintenance_interval_days === ""
            ? null
            : Number(body.maintenance_interval_days),
      };

      if (!payload.category) {
        return res.status(400).json({
          message: "category is required",
        });
      }

      if (!payload.name) {
        return res.status(400).json({
          message: "name is required",
        });
      }

      if (!payload.installation_date) {
        return res.status(400).json({
          message: "installation_date is required",
        });
      }

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

      console.log(`POST /equipment/${id} status:`, response.status);
      console.log(`POST /equipment/${id} payload:`, payload);
      console.log(`POST /equipment/${id} response:`, data);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося додати обладнання"),
          detail: data?.detail,
          backendStatus: response.status,
          sentPayload: payload,
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