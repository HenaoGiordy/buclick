package com.univalle.bubackend.services.appointment.validations;

import com.univalle.bubackend.DTOs.appointment.AvailableDateDTO;
import com.univalle.bubackend.models.UserEntity;

public interface AppointmentDateCreationValidation {
    void validateIsProfessional(UserEntity userEntity);
}
