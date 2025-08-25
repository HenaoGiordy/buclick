package com.univalle.bubackend.DTOs.auth;

import com.univalle.bubackend.DTOs.user.UserResponse;

public record AuthResponse(UserResponse userResponse, String message, String token) {
}
