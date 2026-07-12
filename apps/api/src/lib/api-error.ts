export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, code = "BAD_REQUEST", details?: unknown) {
    return new ApiError(400, code, message, details);
  }

  static notFound(message: string, code = "NOT_FOUND", details?: unknown) {
    return new ApiError(404, code, message, details);
  }
}
