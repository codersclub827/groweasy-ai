export const webEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "GrowEasy AI CSV Importer",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
} as const;
