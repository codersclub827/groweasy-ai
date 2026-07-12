import { z } from "zod";

import { ApiError } from "../../lib/api-error.js";
import { generateCrmMappingBatch } from "./gemini.service.js";
import type {
  CrmMappingBatch,
  CrmMappingResult,
  CsvRow,
  InvalidCsvRow,
  ValidCsvRow
} from "../types/import.types.js";

const BATCH_SIZE = 25;

const crmMappedRowSchema = z.object({
  rowIndex: z.number().int().nonnegative(),
  mappedFields: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().email().nullable(),
    phone: z.string().nullable(),
    company: z.string().nullable(),
    jobTitle: z.string().nullable(),
    leadSource: z.string().nullable(),
    leadStatus: z.string().nullable(),
    website: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    countryCode: z.string().length(2).nullable(),
    postalCode: z.string().nullable(),
    address: z.string().nullable(),
    notes: z.string().nullable()
  }),
  customFields: z.record(z.string()),
  confidence: z.number().min(0).max(1),
  issues: z.array(z.string())
});

const aiSkippedRowSchema = z.object({
  rowIndex: z.number().int().nonnegative(),
  reason: z.string().min(1)
});

const crmMappingBatchSchema = z.object({
  rows: z.array(crmMappedRowSchema),
  skippedRows: z.array(aiSkippedRowSchema)
});

function hasValue(value: CsvRow[string]) {
  if (value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return true;
}

function normalizeValue(value: CsvRow[string]) {
  if (value === null) {
    return "";
  }

  return String(value).trim();
}

function validateRows(columns: string[], rows: CsvRow[]) {
  return rows.reduce<{
    validRows: ValidCsvRow[];
    skippedRows: InvalidCsvRow[];
  }>(
    (result, row, index) => {
      const normalizedRow = columns.reduce<CsvRow>((nextRow, column) => {
        nextRow[column] = normalizeValue(row[column] ?? null);
        return nextRow;
      }, {});

      const hasAnyColumnValue = columns.some((column) => hasValue(normalizedRow[column]));

      if (!hasAnyColumnValue) {
        result.skippedRows.push({
          rowIndex: index,
          reason: "Row does not contain any importable values.",
          row
        });
        return result;
      }

      result.validRows.push({
        rowIndex: index,
        row: normalizedRow
      });
      return result;
    },
    {
      validRows: [],
      skippedRows: []
    }
  );
}

function chunkRows(rows: ValidCsvRow[]) {
  const chunks: ValidCsvRow[][] = [];

  for (let index = 0; index < rows.length; index += BATCH_SIZE) {
    chunks.push(rows.slice(index, index + BATCH_SIZE));
  }

  return chunks;
}

function validateBatchCoverage(
  batchRows: ValidCsvRow[],
  mappedIndexes: number[],
  skippedIndexes: number[]
) {
  const expectedIndexes = new Set(batchRows.map((row) => row.rowIndex));
  const returnedIndexes = [...mappedIndexes, ...skippedIndexes];
  const uniqueReturnedIndexes = new Set(returnedIndexes);

  if (returnedIndexes.length !== uniqueReturnedIndexes.size) {
    throw ApiError.badRequest("Gemini returned duplicate row indexes.", "AI_DUPLICATE_ROW_INDEX");
  }

  const hasUnknownIndex = returnedIndexes.some((rowIndex) => !expectedIndexes.has(rowIndex));

  if (hasUnknownIndex || uniqueReturnedIndexes.size !== expectedIndexes.size) {
    throw ApiError.badRequest(
      "Gemini did not account for every row exactly once.",
      "AI_ROW_COVERAGE_ERROR"
    );
  }
}

export async function mapCsvRowsToCrm(
  columns: string[],
  rows: CsvRow[]
): Promise<CrmMappingResult> {
  const { validRows, skippedRows } = validateRows(columns, rows);

  if (validRows.length === 0) {
    return {
      crmFields: [],
      mappedRows: [],
      skippedRows,
      batches: [],
      batchSize: BATCH_SIZE,
      processedRowCount: 0,
      skippedRowCount: skippedRows.length
    };
  }

  const batches: CrmMappingBatch[] = [];
  const mappedRows: CrmMappingResult["mappedRows"] = [];
  const rowChunks = chunkRows(validRows);

  for (const [batchIndex, batchRows] of rowChunks.entries()) {
    const batchResponse = await generateCrmMappingBatch({
      batchIndex,
      columns,
      rows: batchRows
    });

    const parsedBatch = crmMappingBatchSchema.safeParse(batchResponse);

    if (!parsedBatch.success) {
      throw ApiError.badRequest(
        "Gemini returned CRM mapping JSON that failed validation.",
        "AI_MAPPING_VALIDATION_ERROR",
        parsedBatch.error.flatten()
      );
    }

    const mappedIndexes = parsedBatch.data.rows.map((row) => row.rowIndex);
    const aiSkippedIndexes = parsedBatch.data.skippedRows.map((row) => row.rowIndex);
    validateBatchCoverage(batchRows, mappedIndexes, aiSkippedIndexes);

    const batchRowsByIndex = new Map(batchRows.map((row) => [row.rowIndex, row.row]));
    const aiSkippedRows = parsedBatch.data.skippedRows.map<InvalidCsvRow>((row) => ({
      rowIndex: row.rowIndex,
      reason: row.reason,
      row: batchRowsByIndex.get(row.rowIndex) ?? {}
    }));

    mappedRows.push(...parsedBatch.data.rows);
    skippedRows.push(...aiSkippedRows);
    batches.push({
      batchIndex,
      inputRowCount: batchRows.length,
      mappedRowCount: parsedBatch.data.rows.length,
      skippedRowCount: parsedBatch.data.skippedRows.length
    });
  }

  const crmFields = Array.from(
    new Set(
      mappedRows.flatMap((row) =>
        Object.keys(row.mappedFields).filter(
          (field) => row.mappedFields[field as keyof typeof row.mappedFields] !== null
        )
      )
    )
  );

  return {
    crmFields,
    mappedRows,
    skippedRows,
    batches,
    batchSize: BATCH_SIZE,
    processedRowCount: mappedRows.length,
    skippedRowCount: skippedRows.length
  };
}
