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
        message: "id is required",
      });
    }

    if (req.method === "GET") {
      const params = new URLSearchParams();

      if (equipment_category && equipment_category !== "all") {
        params.append("equipment_category", String(equipment_category));
      }

      const queryString = params.toString();
      const backendUrl = `${API_URL}/equipment/${id}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(backendUrl, {
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
      const payload = {
        category: String(req.body?.category || "").trim(),
        name: String(req.body?.name || "").trim(),
        installation_date: req.body?.installation_date,
        specifications: req.body?.specifications
          ? String(req.body.specifications).trim()
          : null,
        maintenance_interval_days:
          req.body?.maintenance_interval_days === "" ||
          req.body?.maintenance_interval_days === null ||
          req.body?.maintenance_interval_days === undefined
            ? null
            : Number(req.body.maintenance_interval_days),
      };

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
      const payload = {
        category: req.body?.category
          ? String(req.body.category).trim()
          : undefined,
        name: req.body?.name ? String(req.body.name).trim() : undefined,
        installation_date: req.body?.installation_date || undefined,
        specifications:
          req.body?.specifications === null
            ? null
            : req.body?.specifications
            ? String(req.body.specifications).trim()
            : undefined,
        maintenance_interval_days:
          req.body?.maintenance_interval_days === "" ||
          req.body?.maintenance_interval_days === undefined
            ? undefined
            : req.body?.maintenance_interval_days === null
            ? null
            : Number(req.body.maintenance_interval_days),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

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

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      if (response.status === 204) {
        return res.status(204).end();
      }

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

      return res.status(200).json(data);
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