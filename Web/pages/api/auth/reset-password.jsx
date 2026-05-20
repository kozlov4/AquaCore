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
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const response = await fetch(`${API_URL}/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.body.email,
        code: req.body.code,
        new_password: req.body.new_password,
      }),
    });

    const data = await readResponse(response);

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Reset password proxy error",
    });
  }
}