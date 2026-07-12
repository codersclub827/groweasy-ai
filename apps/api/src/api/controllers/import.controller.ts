import type { Request, Response } from "express";

import { confirmImport, createPreview } from "../services/import.service.js";
import type { ConfirmImportRequest, PreviewImportRequest } from "../types/import.types.js";

export async function previewImportController(
  request: Request<unknown, unknown, PreviewImportRequest>,
  response: Response
) {
  const preview = await createPreview(request.body);

  response.status(200).json({
    success: true,
    data: preview
  });
}

export async function confirmImportController(
  request: Request<unknown, unknown, ConfirmImportRequest>,
  response: Response
) {
  const confirmation = await confirmImport(request.body);

  response.status(201).json({
    success: true,
    data: confirmation
  });
}
