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

export const config = {
  api: {
    bodyParser: false,
  },
};

async function requestToFormData(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const contentType = req.headers["content-type"];

  const response = new Response(buffer, {
    headers: {
      "Content-Type": contentType,
    },
  });

  return response.formData();
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    const incomingFormData = await requestToFormData(req);
    const file = incomingFormData.get("file");

    if (!file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetch(`${API_URL}/upload-image/`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: backendFormData,
    });

    const data = await readResponse(response);

    console.log("POST /upload-image status:", response.status);
    console.log("POST /upload-image response:", data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Upload image proxy error:", error);

    return res.status(500).json({
      message: error.message || "Upload image proxy server error",
    });
  }
}