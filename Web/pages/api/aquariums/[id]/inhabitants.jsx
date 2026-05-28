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

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
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
    const { id } = req.query;

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

    const payload = {
      species_id: Number(req.body?.species_id),
      quantity: Number(req.body?.quantity),
      settlement_date: req.body?.settlement_date,
    };

    if (!payload.species_id) {
      return res.status(400).json({
        message: "species_id is required",
      });
    }

    if (!payload.quantity || payload.quantity <= 0) {
      return res.status(400).json({
        message: "quantity must be greater than 0",
      });
    }

    if (!payload.settlement_date) {
      return res.status(400).json({
        message: "settlement_date is required",
      });
    }

    const response = await fetch(`${API_URL}/aquariums/${id}/inhabitants`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    const data = await readResponse(response);

    console.log(`POST /aquariums/${id}/inhabitants status:`, response.status);
    console.log(`POST /aquariums/${id}/inhabitants payload:`, payload);
    console.log(`POST /aquariums/${id}/inhabitants response:`, data);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося заселити рибу"),
        detail: data?.detail,
        sentPayload: payload,
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Add inhabitant proxy error:", error);

    return res.status(500).json({
      message: error.message || "Add inhabitant proxy server error",
    });
  }
}