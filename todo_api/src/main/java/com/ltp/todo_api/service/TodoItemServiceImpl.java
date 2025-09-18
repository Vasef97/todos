package com.ltp.todo_api.service;

import com.ltp.todo_api.entity.TodoItem;
import com.ltp.todo_api.exception.TodoItemNotFoundException;
import com.ltp.todo_api.repository.TodoItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoItemServiceImpl implements TodoItemService {

    private final TodoItemRepository todoItemRepository;

    public TodoItemServiceImpl(TodoItemRepository todoItemRepository) {
        this.todoItemRepository = todoItemRepository;
    }

    @Override
    public TodoItem createTodoItem(TodoItem todoItem) {
        return todoItemRepository.save(todoItem);
    }

    @Override
    public TodoItem getTodoItemById(Long id) {
        return todoItemRepository.findById(id)
                .orElseThrow(() -> new TodoItemNotFoundException(id));
    }

    @Override
    public List<TodoItem> getTodoItemsByTodoListId(Long todoListId) {
        return todoItemRepository.findByTodoListId(todoListId);
    }

    @Override
    public List<TodoItem> getAllTodoItems() {
        return todoItemRepository.findAll();
    }

    @Override
    public TodoItem updateTodoItem(Long id, String newText, boolean done) {
        TodoItem item = todoItemRepository.findById(id)
                .orElseThrow(() -> new TodoItemNotFoundException(id));

        item.setText(newText);
        item.setDone(done);

        return todoItemRepository.save(item);
    }

    @Override
    public void deleteTodoItem(Long id) {
        TodoItem item = todoItemRepository.findById(id)
                .orElseThrow(() -> new TodoItemNotFoundException(id));
        todoItemRepository.delete(item);
    }
}
