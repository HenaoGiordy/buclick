package com.univalle.bubackend.DTOs.report;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record ReportResponse(Integer id, LocalDate date, String semester, String beca, List<UserDTO> users) {
}

