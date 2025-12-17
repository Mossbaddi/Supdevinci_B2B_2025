import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/database.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API",
  });
});


import articlesRouter from "./routes/articles.js";
app.use('/api/articles', articlesRouter);


async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // Instructions à lancer au lancement
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur : ", error);
    process.exit(1);
  }
}


startServer()
