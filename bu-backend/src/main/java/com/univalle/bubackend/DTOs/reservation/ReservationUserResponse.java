package com.univalle.bubackend.DTOs.reservation;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservationUserResponse(
        String message,
        Integer reservationId,
        LocalDateTime date,
        LocalTime time,
        Boolean paid,
        Boolean lunch,
        Boolean snack,
        String username,
        String name,
        String lastName
) {
}
