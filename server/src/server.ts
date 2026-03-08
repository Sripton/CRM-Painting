import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./db/prisma.js";
import cookieParser from "cookie-parser";
import authAPIRouter from "./api/authRouter.js";
import artWorkImageAPIRouter from "./api/artworksImagesRouter.js";
import { error } from "console";

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
app.use("/api", artWorkImageAPIRouter);

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
