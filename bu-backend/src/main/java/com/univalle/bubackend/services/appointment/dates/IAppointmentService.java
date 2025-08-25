package com.univalle.bubackend.services.appointment.dates;

import com.univalle.bubackend.DTOs.appointment.*;

public interface IAppointmentService {
    ResponseAvailableDate availableDatesAssign(RequestAvailableDate requestAvailableDate);
    ResponseAllAvailableDates getAllDatesProfessional(Integer professionalId);
    ResponseDeleteAvailableDate deleteAvailableDate(Integer id);

    ResponseAllDatesType getAllAvailableDatesType(String type, Integer studentId);

    void deleteAllDatesPerDate(AvailableDatesListDTO availableDatesListDTO);
}
