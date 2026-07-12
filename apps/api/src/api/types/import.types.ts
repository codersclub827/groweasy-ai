export type CsvRow = Record<string, string | number | boolean | null>;

export type ValidCsvRow = {
  rowIndex: number;
  row: CsvRow;
};

export type InvalidCsvRow = {
  rowIndex: number;
  reason: string;
  row: CsvRow;
};

export type CrmMappedFields = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  leadSource: string | null;
  leadStatus: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  postalCode: string | null;
  address: string | null;
  notes: string | null;
};

export type CrmMappedRow = {
  rowIndex: number;
  mappedFields: CrmMappedFields;
  customFields: Record<string, string>;
  confidence: number;
  issues: string[];
};

export type CrmMappingBatch = {
  batchIndex: number;
  inputRowCount: number;
  mappedRowCount: number;
  skippedRowCount: number;
};

export type CrmMappingResult = {
  crmFields: string[];
  mappedRows: CrmMappedRow[];
  skippedRows: InvalidCsvRow[];
  batches: CrmMappingBatch[];
  batchSize: number;
  processedRowCount: number;
  skippedRowCount: number;
};

export type PreviewImportRequest = {
  fileName?: string;
  columns: string[];
  rows: CsvRow[];
};

export type PreviewImportResponse = {
  importId: string;
  fileName?: string;
  columns: string[];
  columnCount: number;
  rowCount: number;
  previewRows: CsvRow[];
  previewRowLimit: number;
  crmMapping: CrmMappingResult;
  status: "preview_ready";
};

export type ConfirmImportRequest = {
  importId: string;
  fileName?: string;
  columns: string[];
  rowCount: number;
};

export type ConfirmImportResponse = {
  confirmationId: string;
  importId: string;
  fileName?: string;
  columnCount: number;
  rowCount: number;
  status: "confirmed";
};
