package com.univalle.bubackend.DTOs.odontology;


import com.univalle.bubackend.models.OdontologyReason;
import java.time.LocalDateTime;

public record VisitResponse(
        LocalDateTime date,
        String name,
        String lastName,
        String username,
        String plan,
        OdontologyReason reason,
        String description
        ) {
}
