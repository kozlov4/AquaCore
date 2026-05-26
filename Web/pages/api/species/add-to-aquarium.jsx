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

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    const aquariumId = Number(req.body?.aquarium_id);
    const speciesId = Number(req.body?.species_id);
    const quantity = Number(req.body?.quantity);
    const settlementDate = req.body?.settlement_date;
    const ignoreWarnings = Boolean(req.body?.ignore_warnings);

    if (!aquariumId) {
      return res.status(400).json({
        message: "aquarium_id is required",
      });
    }

    if (!speciesId) {
      return res.status(400).json({
        message: "species_id is required",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "quantity must be greater than 0",
      });
    }

    if (!settlementDate) {
      return res.status(400).json({
        message: "settlement_date is required",
      });
    }

    const backendBody = {
      species_id: speciesId,
      quantity,
      settlement_date: settlementDate,
      ignore_warnings: ignoreWarnings,
    };

    console.log("Add species frontend body:", req.body);
    console.log(
      "Add species backend url:",
      `${API_URL}/aquariums/${aquariumId}/inhabitants`
    );
    console.log("Add species backend body:", backendBody);

    const response = await fetch(
      `${API_URL}/aquariums/${aquariumId}/inhabitants`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(backendBody),
      }
    );

    const data = await readResponse(response);

    console.log(
      `POST /aquariums/${aquariumId}/inhabitants status:`,
      response.status
    );
    console.log(`POST /aquariums/${aquariumId}/inhabitants response:`, data);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося заселити вид в акваріум"),
        detail: data?.detail,
        backendStatus: response.status,
        sentPayload: backendBody,
      });
    }

    return res.status(response.status || 201).json(data);
  } catch (error) {
    console.error("Add species proxy error:", error);

    return res.status(500).json({
      message: error.message || "Add species proxy server error",
    });
  }
}