package com.univalle.bubackend.DTOs.nursing;

import com.univalle.bubackend.models.Diagnostic;

import java.util.Map;

public record NursingReportRequest(
        int year,
        int trimester,
        Map<Diagnostic, Integer> diagnosticCounts // opcional, puede ser null
) {}

