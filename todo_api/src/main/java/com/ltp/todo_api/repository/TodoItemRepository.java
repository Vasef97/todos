package com.ltp.todo_api.repository;

import com.ltp.todo_api.entity.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoItemRepository extends JpaRepository<TodoItem, Long> {
    List<TodoItem> findByTodoListId(Long todoListId);
}
