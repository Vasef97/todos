package com.ltp.todo_api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "todo_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodoList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String iconCode;
    private String color;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-todoLists")
    private User user;

    @OneToMany(mappedBy = "todoList", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("list-todoItems")
    private List<TodoItem> items;
}
