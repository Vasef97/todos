package com.ltp.todo_api.service;

import com.ltp.todo_api.entity.TodoList;
import com.ltp.todo_api.exception.TodoListNotFoundException;
import com.ltp.todo_api.repository.TodoListRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoListServiceImpl implements TodoListService {

    private final TodoListRepository todoListRepository;

    public TodoListServiceImpl(TodoListRepository todoListRepository) {
        this.todoListRepository = todoListRepository;
    }

    @Override
    public TodoList createTodoList(TodoList todoList) {
        return todoListRepository.save(todoList);
    }

    @Override
    public TodoList getTodoListById(Long id) {
        return todoListRepository.findById(id)
                .orElseThrow(() -> new TodoListNotFoundException(id));
    }

    @Override
    public List<TodoList> getTodoListsByUserId(Long userId) {
        return todoListRepository.findByUserId(userId);
    }

    @Override
    public List<TodoList> getAllTodoLists() {
        return todoListRepository.findAll();
    }

    @Override
    public TodoList updateTodoListName(Long id, String newName) {
        TodoList list = todoListRepository.findById(id)
                .orElseThrow(() -> new TodoListNotFoundException(id));
        list.setName(newName);
        return todoListRepository.save(list);
    }

    @Override
    public void deleteTodoList(Long id) {
        TodoList todoList = todoListRepository.findById(id)
                .orElseThrow(() -> new TodoListNotFoundException(id));
        todoListRepository.delete(todoList);
    }
}
