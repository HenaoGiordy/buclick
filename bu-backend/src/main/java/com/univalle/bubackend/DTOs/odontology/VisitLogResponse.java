package com.univalle.bubackend.DTOs.odontology;

import com.univalle.bubackend.models.OdontologyReason;

import java.time.LocalDate;
import java.time.LocalTime;

public record VisitLogResponse(
        Long id,
        LocalDate date,
        LocalTime time,
        String username,
        String name,
        String lastname,
        String plan,
        OdontologyReason reason,
        String description
) {
}
