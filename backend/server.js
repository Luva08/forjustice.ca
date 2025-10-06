import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "afj-api" }));
app.get("/api/ping", (_req, res) => res.json({ pong: true }));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`AFJ API listening on ${port}`));
