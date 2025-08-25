package com.univalle.bubackend.DTOs.appointment;

import jakarta.validation.constraints.NotNull;

public record RequestAssistance(
        @NotNull(message = "debes proveer un id de la cita") Integer appointmentId,
        @NotNull(message = "Debes ingresar el estatus de la asistencia") Boolean status) {
}
