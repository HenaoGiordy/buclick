package com.univalle.bubackend.DTOs.reservation;

import java.time.LocalTime;

public record AvailabilityPerHourResponse (
        Integer availability,
        LocalTime start,
        LocalTime end,
        String type
){
}
