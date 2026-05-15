const API_URL = "https://aquacore-api-backend-g5deexehc8a9behz.polandcentral-01.azurewebsites.net";

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
        image_id: req.body.image_id || null,
      };

      const response = await fetch(`${API_URL}/aquariums/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const data = await readResponse(response);

      console.log(`PUT /aquariums/${id} status:`, response.status);
      console.log(`PUT /aquariums/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/aquariums/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      console.log(`DELETE /aquariums/${id} status:`, response.status);

      if (response.status === 204) {
        return res.status(204).end();
      }

      const data = await readResponse(response);

      console.log(`DELETE /aquariums/${id} response:`, data);

      return res.status(response.status).json(data);
    }

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