package com.ltp.todo_api.web;
/**
 * Generic wrapper for all API responses.
 *
 * @param message human-readable status or error message
 * @param data    the payload (object, list, or null)
 */
public record ApiResponse<T>(String message, T data) {
}
