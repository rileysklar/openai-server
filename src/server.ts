import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());

interface OpenAIRequestBody {
  prompt: string;
}
app.get("/", helloWorld);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function helloWorld(req: Request, res: Response) {
  res.send("Hello, World!");
}

app.connect("/api/openai", (req, res) => {
  res.send("OK");
});

app.post(
  "/api/openai",
  async (req: Request<{}, {}, OpenAIRequestBody>, res: Response) => {
    const { prompt } = req.body;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        { prompt, max_tokens: 150 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        res.status(500).json({
          message: "Error communicating with OpenAI",
          details: error.response?.data || error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          message: "An unexpected error occurred",
        });
      }
    }
  }
);
