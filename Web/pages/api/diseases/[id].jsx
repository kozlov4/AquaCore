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

    const response = await fetch(`${API_URL}/diseases/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Disease detail proxy error:", error);

    return res.status(500).json({
      message: error.message || "Disease detail proxy server error",
    });
  }
}