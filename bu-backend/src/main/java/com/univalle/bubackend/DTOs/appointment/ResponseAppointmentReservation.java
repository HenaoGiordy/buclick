package com.univalle.bubackend.DTOs.appointment;

import com.univalle.bubackend.DTOs.user.UserResponse;

public record ResponseAppointmentReservation(String message, AvailableDateDTO appointment, UserResponse patient) {
}
