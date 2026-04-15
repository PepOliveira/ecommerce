package com.pedrooliveira.ecommerce.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String senha;
}