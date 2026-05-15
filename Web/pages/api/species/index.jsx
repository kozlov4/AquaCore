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
    if (req.method !== "GET") {
      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const { search, category, water_type, character } = req.query;

    const params = new URLSearchParams();

    if (search) params.append("search", String(search));
    if (category && category !== "all") params.append("category", String(category));
    if (water_type && water_type !== "all") params.append("water_type", String(water_type));
    if (character && character !== "all") params.append("character", String(character));

    const response = await fetch(
      `${API_URL}/species/${params.toString() ? `?${params.toString()}` : ""}`,
      {
        method: "GET",
      }
    );

    const data = await readResponse(response);

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Species proxy server error",
    });
  }
}