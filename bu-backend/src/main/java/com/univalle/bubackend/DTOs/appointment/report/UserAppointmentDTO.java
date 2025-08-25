package com.univalle.bubackend.DTOs.appointment.report;

public record UserAppointmentDTO(String username,
                                 String name,
                                 String lastName,
                                 String email,
                                 String plan,
                                 String semester,
                                 String eps,
                                 Long phone,
                                 String gender
                                 ) {
}
