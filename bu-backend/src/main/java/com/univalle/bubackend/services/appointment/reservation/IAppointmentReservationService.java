package com.univalle.bubackend.services.appointment.reservation;

import com.univalle.bubackend.DTOs.appointment.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

public interface IAppointmentReservationService {

    ResponseAppointmentReservation reserveAppointment(RequestAppointmentReservation requestAppointmentReservation);

    ResponseAppointmentReservationProfessional allAppointmentProfessional(Integer professionalId);

    ResponseAppointmentReservationProfessional allAppointmentProfessionalPending(Integer professionalId, Pageable pageable);

    ResponseAppointmentReservationProfessional allAppointmentProfessionalAttended(Integer professionalId, Pageable pageable);

    ResponseAppointmentReservationProfessional allAppointmentProfessionalAttendedByDate( Integer professionalId, String specificDate, Pageable pageable);

    ResponseAppointmentReservationStudent allAppointmentEstudiante(Integer estudianteId);

    ResponseAppointmentCancel cancelReservation(Integer id);

    ResponseAssistanceAppointment assistance(RequestAssistance requestAssistance);

    ResponseAppointmentFollowUp followUp(RequestAppointmentFollowUp requestAppointmentFollowUp);

    UserResponseAppointment findReservationsByUsername(String username, Pageable pageable);

    ByteArrayInputStream downloadAppointmentReport(Integer professionalId);
}