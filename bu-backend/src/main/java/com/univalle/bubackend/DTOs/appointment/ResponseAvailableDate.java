package com.univalle.bubackend.DTOs.appointment;

import java.util.List;

public record ResponseAvailableDate(String message, Integer professional, List<AvailableDateDTO> availableDates) {
}
