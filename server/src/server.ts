import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./db/prisma/prisma.js";
import cookieParser from "cookie-parser";
import authAPIRouter from "./api/auth/authRouter.js";
import artWorkImageAPIRouter from "./api/admin/artworksImagesRouter.js";
import adminArtworksRouter from "./api/admin/adminArtworksRouter.js";
const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
); // Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков

// роутеры
app.use("/api/auth", authAPIRouter);
app.use("/api/admin", artWorkImageAPIRouter);
app.use("/api/admin", adminArtworksRouter);

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
