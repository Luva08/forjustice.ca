import express from "express";
import cors from "cors";
import i18next from "i18next";
import i18nextMiddleware from "i18next-express-middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// i18n setup
i18next.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: { welcome: "Welcome to AFJ API" } },
    fr: { translation: { welcome: "Bienvenue à l'API AFJ" } },
    es: { translation: { welcome: "Bienvenido a la API AFJ" } }
  }
});
app.use(i18nextMiddleware.handle(i18next));

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health endpoint
app.get("/health", (req, res) => res.json({ ok: true, service: "afj-api", lang: req.language }));

// Auth sample
app.post("/login", (req, res) => {
  const { username } = req.body;
  // Normally validate user
  const token = jwt.sign({ username }, "SECRET", { expiresIn: "1h" });
  res.json({ token });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`AFJ API listening on ${port}`));
