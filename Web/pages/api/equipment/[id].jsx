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

function normalizeEquipmentPayload(body) {
  return {
    category: body?.category ? String(body.category).trim() : undefined,
    name: body?.name ? String(body.name).trim() : undefined,
    installation_date: body?.installation_date || undefined,
    specifications: body?.specifications
      ? String(body.specifications).trim()
      : null,
    maintenance_interval_days:
      body?.maintenance_interval_days === "" ||
      body?.maintenance_interval_days === null ||
      body?.maintenance_interval_days === undefined
        ? null
        : Number(body.maintenance_interval_days),
  };
}

function removeUndefinedFields(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
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
      const { equipment_category } = req.query;
      const params = new URLSearchParams();

      if (equipment_category && equipment_category !== "all") {
        params.append("equipment_category", String(equipment_category));
      }

      const query = params.toString();

      const response = await fetch(
        `${API_URL}/equipment/${id}${query ? `?${query}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );

      const data = await readResponse(response);

      console.log(`GET /equipment/${id} status:`, response.status);
      console.log(`GET /equipment/${id} response:`, data);

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

    if (req.method === "PATCH") {
      const payload = removeUndefinedFields(normalizeEquipmentPayload(req.body));

      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      console.log(`PATCH /equipment/${id} status:`, response.status);
      console.log(`PATCH /equipment/${id} payload:`, payload);
      console.log(`PATCH /equipment/${id} response:`, data);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося оновити обладнання"),
          detail: data?.detail,
          backendStatus: response.status,
          sentPayload: payload,
        });
      }

      return res.status(response.status || 200).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log(`DELETE /equipment/${id} status:`, response.status);
      console.log(`DELETE /equipment/${id} response:`, data);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося видалити обладнання"),
          detail: data?.detail,
          backendStatus: response.status,
        });
      }

      return res.status(response.status || 204).json(data);
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);

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