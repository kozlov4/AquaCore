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
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (req.method === "GET") {
      const { category, aquarium_name, sort_order = "newest" } = req.query;

      const params = new URLSearchParams();

      if (category && category !== "Всі фотографії") {
        params.append("category", String(category));
      }

      if (aquarium_name && aquarium_name !== "Усі акваріуми") {
        params.append("aquarium_name", String(aquarium_name));
      }

      if (sort_order) {
        params.append("sort_order", String(sort_order));
      }

      const response = await fetch(
        `${API_URL}/gallery/${params.toString() ? `?${params.toString()}` : ""}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await readResponse(response);

      console.log("GET /gallery status:", response.status);
      console.log("GET /gallery response:", data);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(`${API_URL}/gallery/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          signature: req.body.signature || null,
          category: req.body.category,
          created_at: req.body.created_at,
          aquarium_id: Number(req.body.aquarium_id),
          image_id: Number(req.body.image_id),
        }),
      });

      const data = await readResponse(response);

      console.log("POST /gallery status:", response.status);
      console.log("POST /gallery response:", data);

      return res.status(response.status).json(data);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Gallery proxy error:", error);

    return res.status(500).json({
      message: error.message || "Gallery proxy server error",
    });
  }
}