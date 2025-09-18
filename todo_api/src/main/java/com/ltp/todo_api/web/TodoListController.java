package com.ltp.todo_api.web;

import com.ltp.todo_api.entity.TodoList;
import com.ltp.todo_api.entity.User;
import com.ltp.todo_api.repository.UserRepository;
import com.ltp.todo_api.service.TodoListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/todo-lists")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Tag(name = "TodoList Controller", description = "Manage todo lists.")
public class TodoListController extends BaseController {

    private final TodoListService todoListService;
    private final UserRepository userRepository;

    public TodoListController(TodoListService todoListService,
            UserRepository userRepository) {
        this.todoListService = todoListService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Operation(summary = "Create a new todo list for the authenticated user.")
    public ResponseEntity<ApiResponse<TodoList>> createTodoList(
            @RequestBody TodoList todoList,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        todoList.setUser(user);
        TodoList saved = todoListService.createTodoList(todoList);

        return created(
                saved,
                "Todo list '" + saved.getName() + "' created successfully");
    }

    @GetMapping
    @Operation(summary = "Get all todo lists for the authenticated user.")
    public ResponseEntity<ApiResponse<List<TodoList>>> getMyTodoLists(
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        List<TodoList> lists = todoListService.getTodoListsByUserId(user.getId());
        if (lists.isEmpty()) {
            return ok(lists, "No todo lists found");
        }
        return ok(lists, "Todo lists retrieved successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific todo list by ID for the authenticated user.")
    public ResponseEntity<ApiResponse<TodoList>> getTodoListById(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        TodoList list = todoListService.getTodoListById(id);
        if (!list.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access is denied");
        }
        return ok(
                list,
                "Todo list '" + list.getName() + "' retrieved successfully");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a todo list.")
    public ResponseEntity<ApiResponse<TodoList>> updateTodoList(
            @PathVariable Long id,
            @RequestBody TodoList payload,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        TodoList existing = todoListService.getTodoListById(id);
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access is denied");
        }

        existing.setName(payload.getName());
        existing.setColor(payload.getColor());
        existing.setIconCode(payload.getIconCode());
        TodoList updated = todoListService.createTodoList(existing);

        return ok(
                updated,
                "Todo list '" + updated.getName() + "' updated successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a todo list.")
    public ResponseEntity<ApiResponse<Void>> deleteTodoList(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        TodoList existing = todoListService.getTodoListById(id);
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access is denied");
        }

        todoListService.deleteTodoList(id);
        return noContent("Todo list deleted successfully");
    }
}
