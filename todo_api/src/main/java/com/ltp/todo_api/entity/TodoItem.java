package com.ltp.todo_api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "todo_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    private boolean done = false;

    @ManyToOne
    @JoinColumn(name = "todo_list_id")
    @JsonBackReference("list-todoItems") 
    private TodoList todoList;
}
