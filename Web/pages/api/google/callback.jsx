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

function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const { code, error } = req.query;

    if (error) {
      return res.redirect(
        `/google/callback?error=${encodeURIComponent(String(error))}`
      );
    }

    if (!code) {
      return res.redirect(
        `/google/callback?error=${encodeURIComponent("Google code is required")}`
      );
    }

    const params = new URLSearchParams({
      code: String(code),
    });

    const response = await fetch(
      `${API_URL}/google/callback?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await readResponse(response);

    if (!response.ok) {
      const errorMessage = getErrorMessage(
        data,
        "Не вдалося завершити Google авторизацію"
      );

      return res.redirect(
        `/google/callback?error=${encodeURIComponent(errorMessage)}`
      );
    }

    const accessToken =
      data?.access_token || data?.accessToken || data?.token || data?.access;

    const refreshToken =
      data?.refresh_token || data?.refreshToken || data?.refresh;

    const tokenType = data?.token_type || data?.tokenType || "Bearer";

    if (!accessToken) {
      return res.redirect(
        `/google/callback?error=${encodeURIComponent(
          "Backend не повернув access_token"
        )}`
      );
    }

    const redirectParams = new URLSearchParams({
      access_token: accessToken,
      token_type: tokenType,
    });

    if (refreshToken) {
      redirectParams.set("refresh_token", refreshToken);
    }

    if (data?.email) {
      redirectParams.set("email", data.email);
    }

    if (data?.name) {
      redirectParams.set("name", data.name);
    }

    if (data?.nickname) {
      redirectParams.set("nickname", data.nickname);
    }

    return res.redirect(`/google/callback?${redirectParams.toString()}`);
  } catch (error) {
    return res.redirect(
      `/google/callback?error=${encodeURIComponent(
        error.message || "Google callback proxy server error"
      )}`
    );
  }
}