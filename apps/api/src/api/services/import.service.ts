import { randomUUID } from "node:crypto";

import { ApiError } from "../../lib/api-error.js";
import { mapCsvRowsToCrm } from "./crm-mapping.service.js";
import type {
  ConfirmImportRequest,
  ConfirmImportResponse,
  PreviewImportRequest,
  PreviewImportResponse
} from "../types/import.types.js";

const PREVIEW_ROW_LIMIT = 25;

export async function createPreview(payload: PreviewImportRequest): Promise<PreviewImportResponse> {
  await Promise.resolve();

  const normalizedColumns = payload.columns.map((column) => column.trim()).filter(Boolean);
  const uniqueColumns = new Set(normalizedColumns);

  if (uniqueColumns.size !== normalizedColumns.length) {
    throw ApiError.badRequest("CSV columns must be unique.", "DUPLICATE_COLUMNS");
  }

  const crmMapping = await mapCsvRowsToCrm(normalizedColumns, payload.rows);

  return {
    importId: randomUUID(),
    fileName: payload.fileName,
    columns: normalizedColumns,
    columnCount: normalizedColumns.length,
    rowCount: payload.rows.length,
    previewRows: payload.rows.slice(0, PREVIEW_ROW_LIMIT),
    previewRowLimit: PREVIEW_ROW_LIMIT,
    crmMapping,
    status: "preview_ready"
  };
}

export async function confirmImport(payload: ConfirmImportRequest): Promise<ConfirmImportResponse> {
  await Promise.resolve();

  return {
    confirmationId: randomUUID(),
    importId: payload.importId,
    fileName: payload.fileName,
    columnCount: payload.columns.length,
    rowCount: payload.rowCount,
    status: "confirmed"
  };
}
