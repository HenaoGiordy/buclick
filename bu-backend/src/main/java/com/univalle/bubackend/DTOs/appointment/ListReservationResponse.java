package com.univalle.bubackend.DTOs.appointment;


import lombok.Builder;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
public record ListReservationResponse(
        Integer id,
        LocalDateTime dateTime,
        String namePycho,
        boolean assistant
) {
}