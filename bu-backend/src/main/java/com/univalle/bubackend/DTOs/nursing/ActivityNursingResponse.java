package com.univalle.bubackend.DTOs.nursing;

import com.univalle.bubackend.models.Diagnostic;
import com.univalle.bubackend.models.NursingActivityLog;

import java.time.LocalDate;
import java.time.LocalTime;

public record ActivityNursingResponse(
        Integer id,
        LocalDate date,
        LocalTime time,
        UserResponse user,
        Diagnostic diagnostic,
        String conduct
) {
    public ActivityNursingResponse(NursingActivityLog activity) {
        this(
                activity.getId(),
                activity.getDate().toLocalDate(),
                activity.getDate().toLocalTime(),
                new UserResponse(activity.getUser()),
                activity.getDiagnostic(),
                activity.getConduct()
        );
    }
}
