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
    if (req.method === "GET") {
      const {
        limit = "6",
        offset = "0",
        min_rate = "0",
        sort_by = "newest",
      } = req.query;

      const params = new URLSearchParams();

      params.append("limit", String(limit));
      params.append("offset", String(offset));
      params.append("min_rate", String(min_rate));
      params.append("sort_by", String(sort_by));

      const response = await fetch(
        `${API_URL}/feedbacks/?${params.toString()}`,
        {
          method: "GET",
        }
      );

      const data = await readResponse(response);

      console.log("GET /feedbacks status:", response.status);
      console.log("GET /feedbacks response:", data);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const token = req.headers.authorization;

      console.log("POST /api/feedbacks body:", req.body);
      console.log("POST /api/feedbacks token exists:", Boolean(token));

      if (!token) {
        return res.status(401).json({
          message: "Authorization token is missing",
        });
      }

      const response = await fetch(`${API_URL}/feedbacks/post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          rate: Number(req.body.rate),
          description: String(req.body.description || ""),
        }),
      });

      const data = await readResponse(response);

      console.log("POST /feedbacks/post status:", response.status);
      console.log("POST /feedbacks/post response:", data);

      return res.status(response.status).json(data);
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Feedback proxy error:", error);

    return res.status(500).json({
      message: error.message || "Feedback proxy server error",
    });
  }
}