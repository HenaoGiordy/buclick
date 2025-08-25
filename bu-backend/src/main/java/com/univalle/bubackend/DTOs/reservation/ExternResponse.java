package com.univalle.bubackend.DTOs.reservation;

public record ExternResponse(
        Integer id,
        String username,
        String name,
        String lastName,
        String plan,
        String email
) {
}
