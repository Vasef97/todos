package com.ltp.todo_api.service;

import com.ltp.todo_api.entity.TodoList;
import java.util.List;

public interface TodoListService {
    TodoList createTodoList(TodoList todoList);

    TodoList getTodoListById(Long id);

    List<TodoList> getTodoListsByUserId(Long userId);

    List<TodoList> getAllTodoLists();

    TodoList updateTodoListName(Long id, String newName);

    void deleteTodoList(Long id);
}
