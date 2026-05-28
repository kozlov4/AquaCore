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

    if (req.method === "GET") {
      const detailResponse = await fetch(`${API_URL}/aquariums/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      const detailData = await readResponse(detailResponse);

      console.log(`GET /aquariums/${id} status:`, detailResponse.status);
      console.log(`GET /aquariums/${id} response:`, detailData);

      if (detailResponse.ok) {
        return res.status(200).json(detailData);
      }

      const listResponse = await fetch(`${API_URL}/aquariums/my-aquariums`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      const listData = await readResponse(listResponse);

      console.log("GET /aquariums/my-aquariums status:", listResponse.status);
      console.log("GET /aquariums/my-aquariums response:", listData);

      if (!listResponse.ok) {
        return res.status(listResponse.status).json({
          message: getErrorMessage(
            listData,
            "Не вдалося завантажити акваріуми"
          ),
          detail: listData?.detail,
          backendStatus: listResponse.status,
        });
      }

      const aquariums = Array.isArray(listData) ? listData : [];
      const aquarium = aquariums.find((item) => String(item.id) === String(id));

      if (!aquarium) {
        return res.status(404).json({
          message: "Акваріум не знайдено",
        });
      }

      return res.status(200).json(aquarium);
    }

    if (req.method === "PUT") {
      const body = {
        name: req.body.name,
        volume:
          req.body.volume === undefined || req.body.volume === ""
            ? undefined
            : Number(req.body.volume),
        type: req.body.type,
        created_at: req.body.created_at,
        image_id:
          req.body.image_id === undefined
            ? undefined
            : req.body.image_id || null,
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
          backendStatus: response.status,
          sentPayload: body,
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
          backendStatus: response.status,
        });
      }

      return res.status(response.status).json(data);
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);

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