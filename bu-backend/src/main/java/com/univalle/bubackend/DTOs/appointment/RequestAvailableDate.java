package com.univalle.bubackend.DTOs.appointment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RequestAvailableDate(@NotEmpty(message = "debes ingresar un horario")
                                   @Valid
                                   List<RequestAvailableDateDTO> availableDates,

                                   @NotNull(message = "Debes proporcionar un profesional") Integer professionalId)
{
}
