package com.ltp.todo_api.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {

    protected <T> ResponseEntity<ApiResponse<T>> ok(T data, String msg) {
        return ResponseEntity
                .ok(new ApiResponse<>(msg, data));
    }

    protected <T> ResponseEntity<ApiResponse<T>> created(T data, String msg) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(msg, data));
    }

    protected ResponseEntity<ApiResponse<Void>> noContent(String msg) {
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse<>(msg, null));
    }
}
