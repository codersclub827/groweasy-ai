export type CsvImportStatus = "idle" | "validating" | "processing" | "complete" | "failed";

export interface ApiResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: {
    code: string;
    message: string;
  };
}
