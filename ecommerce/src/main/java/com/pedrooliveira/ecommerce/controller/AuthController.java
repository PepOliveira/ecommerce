package com.pedrooliveira.ecommerce.controller;

import com.pedrooliveira.ecommerce.dto.AuthRequest;
import com.pedrooliveira.ecommerce.model.Usuario;
import com.pedrooliveira.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/registro")
    public ResponseEntity<String> registro(@Valid @RequestBody Usuario usuario) {
        String token = authService.registro(usuario);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        String token = authService.login(request.getEmail(), request.getSenha());
        return ResponseEntity.ok(token);
    }
}