package com.ltp.todo_api.service;

import com.ltp.todo_api.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    void deleteUser(Long id);
    Optional<User> findByUsername(String username);
}

    