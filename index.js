import express from "express";
import { handler } from "./function.js";

const app = express();
app.use(express.json());

app.all("*", async (req, res) => {
  const event = {
    httpMethod: req.method,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : null,
    queryStringParameters: req.query,
    path: req.path
  };

  try {
    const result = await handler(event, {});
    res.status(result.statusCode || 200);

    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
    }

    res.send(result.body);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
