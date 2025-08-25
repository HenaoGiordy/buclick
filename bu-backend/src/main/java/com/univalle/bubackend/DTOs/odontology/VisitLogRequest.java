package com.univalle.bubackend.DTOs.odontology;

import com.univalle.bubackend.models.OdontologyReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record VisitLogRequest(
        @NotNull LocalDate date,
        @NotBlank String username,
        @NotNull String name,
        @NotNull String lastname,
        @NotNull String plan,
        @NotNull OdontologyReason reason,
        @NotBlank String description) {
}
