package com.univalle.bubackend.DTOs.odontology;

import org.springframework.data.domain.Page;

public record VisitOdontologyResponse(Page<com.univalle.bubackend.models.VisitOdontologyLog> list, UserResponse user) {
}
