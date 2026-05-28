const API_URL = "https://aquacore.onrender.com";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const response = await fetch(`${API_URL}/google/login`, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: "application/json",
      },
    });

    const location = response.headers.get("location");

    if (location) {
      return res.redirect(location);
    }

    const text = await response.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        message: text || "Empty response from backend",
      };
    }

    const redirectUrl =
      data?.authorization_url ||
      data?.auth_url ||
      data?.url ||
      data?.redirect_url ||
      data?.redirectUrl;

    if (redirectUrl) {
      return res.redirect(redirectUrl);
    }

    if (!response.ok) {
      return res.status(response.status).json({
        message:
          data?.message ||
          data?.detail ||
          "Не вдалося почати Google авторизацію",
        detail: data?.detail,
        backendStatus: response.status,
        raw: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Google login proxy error:", error);

    return res.status(500).json({
      message: error.message || "Google login proxy server error",
    });
  }
}