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

function getRedirectUrl(data) {
  return (
    data?.authorization_url ||
    data?.auth_url ||
    data?.url ||
    data?.redirect_url ||
    data?.redirectUrl ||
    null
  );
}

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

    const data = await readResponse(response);
    const redirectUrl = getRedirectUrl(data);

    if (redirectUrl) {
      return res.redirect(redirectUrl);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Google login proxy server error",
    });
  }
}