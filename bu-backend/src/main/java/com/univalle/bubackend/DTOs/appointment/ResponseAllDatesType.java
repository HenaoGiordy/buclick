package com.univalle.bubackend.DTOs.appointment;

import java.util.List;

public record ResponseAllDatesType(String type, List<AvailableDateDTO> availableDates) {
}
