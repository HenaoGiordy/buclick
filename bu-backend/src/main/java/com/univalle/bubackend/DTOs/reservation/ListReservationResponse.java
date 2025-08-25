package com.univalle.bubackend.DTOs.reservation;

import lombok.Builder;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
public record ListReservationResponse(
        Integer id,
        LocalDateTime data,
        LocalTime time,
        Boolean paid,
        Boolean snack,
        Boolean lunch,
        String username,
        String name,
        String lastName
) {
}