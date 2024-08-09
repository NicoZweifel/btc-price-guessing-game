import { createClient } from "redis";

export type ClientType = ReturnType<typeof createClient>;

export const getRedisClient = () =>
  createClient({ url: process.env.REDIS })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
