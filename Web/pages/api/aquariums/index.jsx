const API_URL = "https://aquacore.onrender.com";

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
      const response = await fetch(`${API_URL}/aquariums/my-aquariums/`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log("GET /aquariums/my-aquariums status:", response.status);
      console.log("GET /aquariums/my-aquariums response:", data);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const body = {
        name: req.body.name,
        volume: Number(req.body.volume),
        type: req.body.type,
        created_at: req.body.created_at,
        image_id: req.body.image_id || null,
      };

      const response = await fetch(`${API_URL}/aquariums/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const data = await readResponse(response);

      console.log("POST /aquariums status:", response.status);
      console.log("POST /aquariums response:", data);

      return res.status(response.status).json(data);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Aquariums proxy error:", error);

    return res.status(500).json({
      message: error.message || "Aquariums proxy server error",
    });
  }
}