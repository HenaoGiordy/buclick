package com.univalle.bubackend.DTOs.nursing;

import com.univalle.bubackend.models.Diagnostic;
import com.univalle.bubackend.models.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record ActivityLogRequest(
        @NotNull LocalDate date,
        @NotBlank String username,
        @NotNull String name,
        @NotNull String lastname,
        @NotNull String plan,
        @NotNull @Positive Long phone,
        @NotBlank String semester,
        @NotNull Gender gender,
        @NotNull Diagnostic diagnostic,
        @NotBlank String conduct
) {
}
