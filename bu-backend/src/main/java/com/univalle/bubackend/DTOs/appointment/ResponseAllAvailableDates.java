package com.univalle.bubackend.DTOs.appointment;

import com.univalle.bubackend.DTOs.user.UserEntityDTO;

import java.util.List;

public record ResponseAllAvailableDates(List<AvailableDateDTO> availableDates, UserEntityDTO professional) {
}
