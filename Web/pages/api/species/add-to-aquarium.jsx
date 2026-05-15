const API_URL = "https://aquacore-api-backend-g5deexehc8a9behz.polandcentral-01.azurewebsites.net";

async function readResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text || "Empty response from backend",
    };
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
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

    const aquariumId = Number(req.body.aquarium_id);
    const speciesId = Number(req.body.species_id);
    const quantity = Number(req.body.quantity);
    const settlementDate = req.body.settlement_date;
    const ignoreWarnings = Boolean(req.body.ignore_warnings);

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

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Add species proxy error:", error);

    return res.status(500).json({
      message: error.message || "Add species proxy server error",
    });
  }
}