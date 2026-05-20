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
    if (req.method !== "GET") {
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

    const response = await fetch(`${API_URL}/aquariums/names/`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    console.log("GET /aquariums/names status:", response.status);
    console.log("GET /aquariums/names response:", data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Aquarium names proxy error:", error);

    return res.status(500).json({
      message: error.message || "Aquarium names proxy server error",
    });
  }
}