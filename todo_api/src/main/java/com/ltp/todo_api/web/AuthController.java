package com.ltp.todo_api.web;

import com.ltp.todo_api.entity.User;
import com.ltp.todo_api.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController extends BaseController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(
            @Valid @RequestBody User user,
            HttpServletRequest request,
            HttpServletResponse response) {

        String rawPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(rawPassword));
        User savedUser = userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(savedUser.getUsername(), rawPassword));
        SecurityContextHolder.getContext().setAuthentication(auth);

        var session = request.getSession(true);
        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            SecurityContextHolder.getContext());

        Cookie cookie = new Cookie("JSESSIONID", session.getId());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return created(
            savedUser,
            "User " + savedUser.getUsername() + " registered successfully"
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(
            @Valid @RequestBody LoginRequest creds,
            HttpServletRequest request,
            HttpServletResponse response) {

        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    creds.getUsername(), creds.getPassword()
                )
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid username or password"
            );
        }

        SecurityContextHolder.getContext().setAuthentication(auth);
        var session = request.getSession(true);
        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            SecurityContextHolder.getContext());

        Cookie cookie = new Cookie("JSESSIONID", session.getId());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        User user = userRepository.findByUsername(creds.getUsername())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));

        return ok(
            user,
            "User " + user.getUsername() + " logged in successfully"
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> me(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));

        return ok(
            user,
            "Current user retrieved successfully"
        );
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMe(
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);

        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return noContent(
            "User " + username + " deleted successfully"
        );
    }
}
