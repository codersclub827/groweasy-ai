import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "../api/middleware/error-handler.js";
import { importRouter } from "../api/routes/import.routes.js";
import { apiEnv } from "../config/env.js";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: apiEnv.corsOrigin
    })
  );
  app.use(express.json({ limit: "5mb" }));

  app.use(importRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
