package com.univalle.bubackend.DTOs.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.univalle.bubackend.models.AvailableDates;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RequestAvailableDateDTO(
        @NotNull(message = "debe proporcionar una fecha")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dateTime,
        @NotNull(message = "debe proporcionar un profesional")
        Integer professionalId,
        @NotEmpty(message = "debe proporcionar un tipo de cita")
        String typeAppointment
) {
}
