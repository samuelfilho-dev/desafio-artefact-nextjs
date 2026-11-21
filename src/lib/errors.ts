import { TRPCClientError } from "@trpc/client";

export function getErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    const code = (error.data as { code?: string } | null)?.code;
    switch (code) {
      case "BAD_REQUEST":
        return "Invalid request. Please check the data you provided.";
      case "NOT_FOUND":
        return "Task not found. It may have been deleted.";
      case "INTERNAL_SERVER_ERROR":
        return "Internal server error. Please try again in a moment.";
    }

    if (error.cause instanceof TypeError) {
      return "Connection failed. Please check your internet connection and try again.";
    }
    return error.message;
  }
  return "An unexpected error occurred.";
}
