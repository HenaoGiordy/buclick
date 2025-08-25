package com.univalle.bubackend.DTOs.reservation;

import jakarta.validation.constraints.NotBlank;

public record ReservationExternRequest(
        @NotBlank String username,
        @NotBlank String name,
        @NotBlank String lastName,
        @NotBlank String plan,
        @NotBlank String email,
        boolean lunch,
        boolean snack) {
}
