package com.univalle.bubackend.services.odontology;

import com.univalle.bubackend.DTOs.odontology.*;
import com.univalle.bubackend.models.VisitOdontologyLog;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

public interface IOdontologyVisitLog {
    UserResponse findStudentsByUsername(String username);

    VisitLogResponse registerVisit(VisitLogRequest request);

    VisitOdontologyResponse visitsOdonotology(String username, LocalDate startDate, LocalDate endDate, Pageable pageable);

    VisitResponse getOdontologyVisit(Long id);

    ByteArrayInputStream downloadOdontologyReport();
}
