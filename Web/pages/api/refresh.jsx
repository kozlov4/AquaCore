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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const refreshToken = req.body?.refresh_token;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is missing",
      });
    }

    const response = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data = await readResponse(response);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Refresh token proxy error:", error);

    return res.status(500).json({
      message: error.message || "Refresh token proxy server error",
    });
  }
}