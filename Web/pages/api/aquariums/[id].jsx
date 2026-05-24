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

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallbackMessage;
}

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Aquarium id is required",
      });
    }

    if (req.method === "PUT") {
      const body = {
        name: req.body.name,
        volume: Number(req.body.volume),
        type: req.body.type,
        created_at: req.body.created_at,
        image_id:
          req.body.image_id === undefined ? undefined : req.body.image_id || null,
      };

      Object.keys(body).forEach((key) => {
        if (body[key] === undefined) {
          delete body[key];
        }
      });

      const response = await fetch(`${API_URL}/aquariums/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося оновити акваріум"),
          detail: data?.detail,
        });
      }

      return res.status(response.status).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/aquariums/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      if (response.status === 204) {
        return res.status(204).end();
      }

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося видалити акваріум"),
          detail: data?.detail,
        });
      }

      return res.status(response.status).json(data);
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Aquarium detail proxy error:", error);

    return res.status(500).json({
      message: error.message || "Aquarium detail proxy server error",
    });
  }
}