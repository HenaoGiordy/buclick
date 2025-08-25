package com.univalle.bubackend.DTOs.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RequestAppointmentFollowUp(
        Integer pacientId,
        Integer professionalId,
        @NotNull(message = "debe proporcionar una fecha")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dateTime) {
}
