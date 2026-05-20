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
        message: "Photo id is required",
      });
    }

    if (req.method === "GET") {
      const response = await fetch(`${API_URL}/gallery/${id}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log(`GET /gallery/${id} status:`, response.status);
      console.log(`GET /gallery/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    if (req.method === "PUT") {
      const response = await fetch(`${API_URL}/gallery/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          signature: req.body.signature || null,
        }),
      });

      const data = await readResponse(response);

      console.log(`PUT /gallery/${id} status:`, response.status);
      console.log(`PUT /gallery/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${API_URL}/gallery/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      console.log(`DELETE /gallery/${id} status:`, response.status);
      console.log(`DELETE /gallery/${id} response:`, data);

      return res.status(response.status).json(data);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Gallery detail proxy error:", error);

    return res.status(500).json({
      message: error.message || "Gallery detail proxy server error",
    });
  }
}