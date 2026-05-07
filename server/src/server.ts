import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./db/prisma/prisma.js";
import cookieParser from "cookie-parser";
import authAPIRouter from "./api/auth/authRouter.js";
import artWorkImageAPIRouter from "./api/admin/artworksApi/artworksImagesRouter.js";
import adminArtworksRouter from "./api/admin/artworksApi/adminArtworksRouter.js";
import publicArtWorksRouter from "./api/publicRouter/artworks.js";
import adminPublicationsRouter from "./api/admin/publicationsApi/adminPublication.js";
import adminPublicationsImageRouter from "./api/admin/publicationsApi/publicationImageRouter.js";
import publicPublicationRouter from "./api/publicRouter/publications.js";
const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" })); // лимит
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
); // Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков

// роутеры
app.use("/api/public", publicArtWorksRouter);
app.use(`/api/public`, publicPublicationRouter);
app.use("/api/auth", authAPIRouter);
app.use("/api/admin", artWorkImageAPIRouter);
app.use("/api/admin", adminArtworksRouter);
app.use(`/api/admin`, adminPublicationsRouter);
app.use("/api/admin", adminPublicationsImageRouter);

app.listen(PORT, () => {
  console.log(`Server start on ${PORT} PORT`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
