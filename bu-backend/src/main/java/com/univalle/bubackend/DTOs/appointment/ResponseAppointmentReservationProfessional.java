package com.univalle.bubackend.DTOs.appointment;

import java.util.List;

public record ResponseAppointmentReservationProfessional(List<AppointmentReservationProfessionalDTO> appointments, long totalElements,
                                                         int totalPages) {
}
