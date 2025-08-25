package com.univalle.bubackend.services.report.nursing;

import com.univalle.bubackend.DTOs.nursing.NursingReportRequest;
import com.univalle.bubackend.DTOs.nursing.NursingReportResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface INursingReportService {
    NursingReportResponse generateNursingReport(NursingReportRequest request);
    NursingReportResponse getNursingReport(Integer id);
    void deleteNursingReport(Integer id);
    List<NursingReportResponse> findNursingReports(Integer year, Integer trimester);
    ByteArrayInputStream downloadNursingReport(Integer id);
    Page<NursingReportResponse> listNursingReports(Pageable pageable);
}
