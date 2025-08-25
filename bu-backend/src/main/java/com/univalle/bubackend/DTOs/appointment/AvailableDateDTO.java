package com.univalle.bubackend.DTOs.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.univalle.bubackend.models.AvailableDates;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public record AvailableDateDTO(
        Integer id,
        @NotNull(message = "debe proporcionar una fecha")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dateTime,
        @NotNull(message = "debe proporcionar un profesional")
        Integer professionalId,
        String professionalName,
        Boolean available,
        @NotEmpty(message = "debe proporcionar un tipo de cita")
        String typeAppointment
) {
        public AvailableDateDTO(AvailableDates availableDates){
                this(
                        availableDates.getId(),
                        availableDates.getDateTime(),
                        availableDates.getProfessional().getId(),
                        availableDates.getProfessional().getName(),
                        availableDates.getAvailable(),
                        availableDates.getTypeAppointment().name()
                );
        }
}