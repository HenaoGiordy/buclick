package com.univalle.bubackend.DTOs.appointment.report;

import java.time.LocalDateTime;

public record AppointmentReservationDTO(Integer id,
                                        LocalDateTime dateTime,
                                        String typeAppointment,
                                        Boolean assistant,
                                        Boolean pendingAppointment,
                                        UserAppointmentDTO user) {
}
