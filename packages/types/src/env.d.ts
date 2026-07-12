declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_API_URL?: string;
    API_PORT?: string;
    API_CORS_ORIGIN?: string;
    GEMINI_API_KEY?: string;
  }
}
