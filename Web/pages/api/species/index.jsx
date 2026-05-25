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

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const {
      search,
      category,
      water_type,
      character,
      max_size,
      difficulty,
      min_volume,
      food_type,
      sort_by,
    } = req.query;

    const params = new URLSearchParams();

    if (search) params.append("search", String(search));
    if (category && category !== "all") params.append("category", String(category));
    if (water_type && water_type !== "all") params.append("water_type", String(water_type));
    if (character && character !== "all") params.append("character", String(character));
    if (max_size && max_size !== "all") params.append("max_size", String(max_size));
    if (difficulty && difficulty !== "all") params.append("difficulty", String(difficulty));
    if (min_volume) params.append("min_volume", String(min_volume));
    if (food_type) params.append("food_type", String(food_type));
    if (sort_by) params.append("sort_by", String(sort_by));

    const response = await fetch(
      `${API_URL}/species${params.toString() ? `?${params.toString()}` : ""}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await readResponse(response);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Species proxy error:", error);

    return res.status(500).json({
      message: error.message || "Species proxy server error",
    });
  }
}