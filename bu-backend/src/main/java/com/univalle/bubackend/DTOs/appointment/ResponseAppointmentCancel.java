package com.univalle.bubackend.DTOs.appointment;

import com.univalle.bubackend.models.AvailableDates;

public record ResponseAppointmentCancel(
        String message,
        AvailableDateDTO availableDateDTO
) {
    public ResponseAppointmentCancel (String message, AvailableDates availableDate) {
        this(message, new AvailableDateDTO(availableDate));
    }
}
