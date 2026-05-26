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
    const token = req.headers.authorization;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    if (req.method === "GET") {
      const params = new URLSearchParams();

      if (
        req.query.equipment_category &&
        req.query.equipment_category !== "all"
      ) {
        params.append(
          "equipment_category",
          String(req.query.equipment_category)
        );
      }

      const queryString = params.toString();

      const response = await fetch(
        `${API_URL}/equipment/${id}${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося завантажити обладнання"),
          detail: data?.detail,
          raw: data,
          backendStatus: response.status,
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(req.body),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося додати обладнання"),
          detail: data?.detail,
          raw: data,
          backendStatus: response.status,
        });
      }

      return res.status(201).json(data);
    }

    if (req.method === "PATCH") {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(req.body),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося оновити обладнання"),
          detail: data?.detail,
          raw: data,
          backendStatus: response.status,
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      const text = await response.text();

      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = {
          message: text || "Empty response from backend",
        };
      }

      console.log("DELETE /equipment backend status:", response.status);
      console.log("DELETE /equipment backend response:", data || text);

      if (response.status === 204) {
        return res.status(204).end();
      }

      if (!response.ok) {
        return res.status(response.status).json({
          message:
            data?.message ||
            data?.detail ||
            text ||
            "Не вдалося видалити обладнання",
          detail: data?.detail,
          raw: data || text,
          backendStatus: response.status,
        });
      }

      return res.status(200).json(data || { success: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Equipment proxy error:", error);

    return res.status(500).json({
      message: error.message || "Equipment proxy server error",
    });
  }
}