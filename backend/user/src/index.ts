import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { Redis } from "@upstash/redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";

dotenv.config();

connectDb();

connectRabbitMQ();

export const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

console.log("Redis client initialized (Upstash REST)");

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
