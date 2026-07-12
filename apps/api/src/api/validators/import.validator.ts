import { z } from "zod";

const csvCellSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const csvRowSchema = z.record(csvCellSchema);

export const previewImportSchema = z.object({
  fileName: z.string().trim().min(1).max(255).optional(),
  columns: z.array(z.string().trim().min(1).max(128)).min(1).max(250),
  rows: z.array(csvRowSchema).min(1).max(10000)
});

export const confirmImportSchema = z.object({
  importId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255).optional(),
  columns: z.array(z.string().trim().min(1).max(128)).min(1).max(250),
  rowCount: z.number().int().nonnegative().max(10000)
});
