package com.univalle.bubackend.DTOs.user;

public record PasswordRequest(String username,
                              String password,
                              String newPassword,
                              String confirmPassword) {
}
