package com.ltp.todo_api.exception;

public class TodoListNotFoundException extends RuntimeException {

    public TodoListNotFoundException(Long id) {
        super("Todo list with ID " + id + " not found");
    }
}
