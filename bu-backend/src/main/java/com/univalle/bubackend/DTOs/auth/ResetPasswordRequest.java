package com.univalle.bubackend.DTOs.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "debes ingresar una contraseña")
        @Size(min = 8, message = "debes ingrear 8 caracteres")
        String password,
        @NotBlank(message = "debes confirmar la contraseña")
        @Size(min = 8, message = "debes ingresar 8 caracteres")
        String passwordConfirmation) {
}
