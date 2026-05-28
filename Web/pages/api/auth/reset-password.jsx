const API_URL = "http://127.0.0.1:8000";

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
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join("; ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

  return fallbackMessage;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const {
      email,
      code,
      new_password,
      repeat_new_password,
      repeatNewPassword,
    } = req.body || {};

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!code) {
      return res.status(400).json({
        message: "Code is required",
      });
    }

    if (!new_password) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    const finalRepeatPassword = repeat_new_password || repeatNewPassword;

    if (!finalRepeatPassword) {
      return res.status(400).json({
        message: "Repeat new password is required",
      });
    }

    const response = await fetch(`${API_URL}/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        new_password,
        repeat_new_password: finalRepeatPassword,
      }),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося змінити пароль"),
        backendStatus: response.status,
        backendResponse: data,
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Reset password proxy error",
    });
  }
}