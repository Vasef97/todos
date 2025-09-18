// src/main/java/com/ltp/todo_api/service/TodoItemService.java
package com.ltp.todo_api.service;

import com.ltp.todo_api.entity.TodoItem;

import java.util.List;

public interface TodoItemService {
    TodoItem createTodoItem(TodoItem todoItem);

    TodoItem getTodoItemById(Long id);

    List<TodoItem> getTodoItemsByTodoListId(Long todoListId);

    List<TodoItem> getAllTodoItems();

    TodoItem updateTodoItem(Long id, String newText, boolean done);

    void deleteTodoItem(Long id);
}
