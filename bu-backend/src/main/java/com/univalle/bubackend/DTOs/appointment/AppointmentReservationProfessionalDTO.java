package com.univalle.bubackend.DTOs.appointment;

import com.univalle.bubackend.DTOs.user.UserEntityDTO;
import com.univalle.bubackend.models.AppointmentReservation;

public record AppointmentReservationProfessionalDTO(Integer reservationId, String patient, String patientLastname, Long phone, AvailableDateDTO availableDate, UserEntityDTO professional, Boolean assitant, Boolean pending) {

    public AppointmentReservationProfessionalDTO(AppointmentReservation appointmentReservation) {
        this(
                appointmentReservation.getId(),
                appointmentReservation.getEstudiante().getName(),
                appointmentReservation.getEstudiante().getLastName(),
                appointmentReservation.getEstudiante().getPhone(),
                new AvailableDateDTO(appointmentReservation.getAvailableDates()),
                new UserEntityDTO(appointmentReservation.getAvailableDates().getProfessional()),
                appointmentReservation.getAssistant(),
                appointmentReservation.getPendingAppointment()
        );
    }

}
