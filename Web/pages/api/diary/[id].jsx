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
    const token = req.headers.authorization;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Diary entry id is required",
      });
    }

    if (req.method === "GET") {
      const response = await fetch(`${API_URL}/diary/${id}/`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log(`GET /diary/${id} status:`, response.status);
      console.log(`GET /diary/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    if (req.method === "PUT") {
      const response = await fetch(`${API_URL}/diary/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          created_at: req.body.created_at,
          aquarium_id: Number(req.body.aquarium_id),
          tag: req.body.tag,
          title: req.body.title,
          observation: req.body.observation,
          image_id: req.body.image_id || null,
          is_pinned: Boolean(req.body.is_pinned),
        }),
      });

      const data = await readResponse(response);

      console.log(`PUT /diary/${id} status:`, response.status);
      console.log(`PUT /diary/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/diary/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log(`DELETE /diary/${id} status:`, response.status);
      console.log(`DELETE /diary/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Diary detail proxy error:", error);

    return res.status(500).json({
      message: error.message || "Diary detail proxy server error",
    });
  }
}