package com.univalle.bubackend.DTOs.user;

public record ViewProfileResponse(
        String name,
        String lastName,
        String email,
        String benefitType
) {
}
