package com.univalle.bubackend.DTOs.appointment;

import jakarta.validation.constraints.NotNull;

public record RequestAppointmentReservation(
        @NotNull(message = "Debes ingresar el Id de una fecha disponible") Integer availableDateId,
        @NotNull(message = "Debes ingresar el Id de un estudiante") Integer pacientId,
        String eps,
        String semester,
        Long phone) {
}
