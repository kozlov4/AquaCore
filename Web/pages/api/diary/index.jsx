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
      const { aquarium_id, tag, search } = req.query;

      const params = new URLSearchParams();

      if (aquarium_id && aquarium_id !== "all") {
        params.append("aquarium_id", String(aquarium_id));
      }

      if (tag && tag !== "all") {
        params.append("tag", String(tag));
      }

      if (search && String(search).trim()) {
        params.append("search", String(search).trim());
      }

      const response = await fetch(
        `${API_URL}/diary/${params.toString() ? `?${params.toString()}` : ""}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await readResponse(response);

      console.log("GET /diary status:", response.status);
      console.log("GET /diary response:", data);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(`${API_URL}/diary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          created_at: req.body.created_at,
          title: req.body.title,
          observation: req.body.observation,
          aquarium_id: Number(req.body.aquarium_id),
          tag: req.body.tag,
          image_id: req.body.image_id || null,
          is_pinned: Boolean(req.body.is_pinned),
        }),
      });

      const data = await readResponse(response);

      console.log("POST /diary status:", response.status);
      console.log("POST /diary response:", data);

      return res.status(response.status).json(data);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Diary proxy error:", error);

    return res.status(500).json({
      message: error.message || "Diary proxy server error",
    });
  }
}