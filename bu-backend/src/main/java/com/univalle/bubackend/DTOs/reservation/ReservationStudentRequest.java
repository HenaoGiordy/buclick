package com.univalle.bubackend.DTOs.reservation;

import jakarta.validation.constraints.NotBlank;

public record ReservationStudentRequest(
        @NotBlank String username,
        boolean lunch,
        boolean snack) {
}
