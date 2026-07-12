import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  PORT: z.coerce.number().int().positive().optional(),
  API_CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().trim().min(1).default("gemini-1.5-flash")
});

const parsedEnv = envSchema.parse(process.env);

export const apiEnv = {
  nodeEnv: parsedEnv.NODE_ENV,
  port: parsedEnv.PORT ?? parsedEnv.API_PORT,
  corsOrigin: parsedEnv.API_CORS_ORIGIN,
  geminiApiKey: parsedEnv.GEMINI_API_KEY,
  geminiModel: parsedEnv.GEMINI_MODEL
} as const;
