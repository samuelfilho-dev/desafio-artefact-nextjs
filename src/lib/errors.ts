import { TRPCClientError } from "@trpc/client";

/**
 * Get a user-friendly error message from a tRPC error.
 * This function checks the error type and code to return a specific message for known errors.
 * If the error is not recognized, it returns a generic unexpected error message.
 * @param {unknown} error - The error object to extract the message from.
 * @returns {string} A user-friendly error message.
 */
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
