const API_URL = "https://aquacore.onrender.com";

async function readErrorResponse(response) {
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
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const { aquarium_id } = req.query;

    if (!aquarium_id) {
      return res.status(400).json({
        message: "aquarium_id is required",
      });
    }

    const params = new URLSearchParams({
      aquarium_id: String(aquarium_id),
    });

    const response = await fetch(`${API_URL}/tests/export/csv?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "text/csv, application/vnd.ms-excel, application/octet-stream, application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const data = await readErrorResponse(response);

      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося експортувати дані"),
        detail: data?.detail,
        backendStatus: response.status,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType =
      response.headers.get("content-type") ||
      "text/csv; charset=utf-8";

    const contentDisposition =
      response.headers.get("content-disposition") ||
      `attachment; filename="water-tests-${aquarium_id}.csv"`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Tests export csv proxy error:", error);

    return res.status(500).json({
      message: error.message || "Tests export csv proxy server error",
    });
  }
}