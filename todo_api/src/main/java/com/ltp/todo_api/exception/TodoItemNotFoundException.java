package com.ltp.todo_api.exception;

public class TodoItemNotFoundException extends RuntimeException {

    public TodoItemNotFoundException(Long id) {
        super("Todo item with ID " + id + " not found");
    }
}
