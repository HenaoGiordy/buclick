package com.univalle.bubackend.DTOs.reservation;

public record AvailabilityResponse(
        Integer remainingSlotsLunch,
        Integer remainingSlotsSnack
) {
}
