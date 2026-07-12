import { Router } from "express";

import {
  confirmImportController,
  previewImportController
} from "../controllers/import.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validateRequest } from "../middleware/validate-request.js";
import { confirmImportSchema, previewImportSchema } from "../validators/import.validator.js";

export const importRouter = Router();

importRouter.post(
  "/preview",
  validateRequest({ body: previewImportSchema }),
  asyncHandler(previewImportController)
);

importRouter.post(
  "/confirm",
  validateRequest({ body: confirmImportSchema }),
  asyncHandler(confirmImportController)
);
