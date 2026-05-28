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
        message: "Disease id is required",
      });
    }

    if (id === "tags") {
      return res.status(400).json({
        message:
          "Invalid disease id. Use /api/diseases/tags for disease tags.",
      });
    }

    const response = await fetch(`${API_URL}/diseases/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await readResponse(response);

    console.log(`GET /diseases/${id} status:`, response.status);
    console.log(`GET /diseases/${id} response:`, data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Disease detail proxy error:", error);

    return res.status(500).json({
      message: error.message || "Disease detail proxy server error",
    });
  }
}