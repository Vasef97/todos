package com.ltp.todo_api.web;

import com.ltp.todo_api.entity.TodoItem;
import com.ltp.todo_api.entity.TodoList;
import com.ltp.todo_api.entity.User;
import com.ltp.todo_api.repository.UserRepository;
import com.ltp.todo_api.service.TodoItemService;
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
@RequestMapping("/todo-lists/{listId}/items")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Tag(name = "TodoItem Controller", description = "Manage items within a todo list.")
public class TodoItemController extends BaseController {

        private final TodoItemService todoItemService;
        private final TodoListService todoListService;
        private final UserRepository userRepository;

        public TodoItemController(TodoItemService todoItemService,
                        TodoListService todoListService,
                        UserRepository userRepository) {
                this.todoItemService = todoItemService;
                this.todoListService = todoListService;
                this.userRepository = userRepository;
        }

        @PostMapping
        @Operation(summary = "Create a new todo item in a specific list.")
        public ResponseEntity<ApiResponse<TodoItem>> createItem(
                        @PathVariable Long listId,
                        @RequestBody TodoItem payload,
                        Authentication authentication) {

                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User not found"));

                TodoList list = todoListService.getTodoListById(listId);
                if (!list.getUser().getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN, "Access is denied");
                }

                payload.setTodoList(list);
                TodoItem saved = todoItemService.createTodoItem(payload);
                return created(
                                saved,
                                "Todo item created successfully in list '" + list.getName() + "'");
        }

        @GetMapping
        @Operation(summary = "Get all todo items for a specific list.")
        public ResponseEntity<ApiResponse<List<TodoItem>>> getItems(
                        @PathVariable Long listId,
                        Authentication authentication) {

                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User not found"));

                TodoList list = todoListService.getTodoListById(listId);
                if (!list.getUser().getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN, "Access is denied");
                }

                List<TodoItem> items = todoItemService.getTodoItemsByTodoListId(listId);
                if (items.isEmpty()) {
                        return ok(
                                        items,
                                        "No todo items found in list '" + list.getName() + "'");
                }
                return ok(
                                items,
                                "Todo items for list '" + list.getName() + "' retrieved successfully");
        }

        @PutMapping("/{itemId}")
        @Operation(summary = "Update a todo item text and done status.")
        public ResponseEntity<ApiResponse<TodoItem>> updateItem(
                        @PathVariable Long listId,
                        @PathVariable Long itemId,
                        @RequestBody TodoItem payload,
                        Authentication authentication) {

                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User not found"));

                TodoList list = todoListService.getTodoListById(listId);
                if (!list.getUser().getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN, "Access is denied");
                }

                TodoItem existing = todoItemService.getTodoItemById(itemId);
                if (!existing.getTodoList().getId().equals(listId)) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN, "Access is denied");
                }

                TodoItem updated = todoItemService.updateTodoItem(
                                itemId,
                                payload.getText(),
                                payload.isDone());

                return ok(
                                updated,
                                "Todo item updated successfully in list '" + list.getName() + "'");
        }

        @DeleteMapping("/{itemId}")
        @Operation(summary = "Delete a todo item.")
        public ResponseEntity<ApiResponse<Void>> deleteItem(
                        @PathVariable Long listId,
                        @PathVariable Long itemId,
                        Authentication authentication) {

                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User not found"));

                TodoList list = todoListService.getTodoListById(listId);
                if (!list.getUser().getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN, "Access is denied");
                }

                TodoItem existing = todoItemService.getTodoItemById(itemId);
                if (!existing.getTodoList().getId().equals(listId)) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN, "Access is denied");
                }

                todoItemService.deleteTodoItem(itemId);
                return noContent(
                                "Todo item deleted successfully from list '" + list.getName() + "'");
        }
}
