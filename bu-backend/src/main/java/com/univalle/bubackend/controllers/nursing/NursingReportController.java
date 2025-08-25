package com.univalle.bubackend.controllers.nursing;

import com.univalle.bubackend.DTOs.nursing.NursingReportRequest;
import com.univalle.bubackend.DTOs.nursing.NursingReportResponse;
import com.univalle.bubackend.DTOs.report.DeleteResponse;
import com.univalle.bubackend.models.NursingReport;
import com.univalle.bubackend.services.report.nursing.NursingReportServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/nursing-report")
@AllArgsConstructor
public class NursingReportController {

    private NursingReportServiceImpl nursingReportService;

    @PostMapping
    public ResponseEntity<NursingReportResponse> generateNursingReport(@RequestBody NursingReportRequest nursingReportRequest) {
        return new ResponseEntity<>(nursingReportService.generateNursingReport(nursingReportRequest), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NursingReportResponse> getNursingReport(@PathVariable int id) {
        return new ResponseEntity<>(nursingReportService.getNursingReport(id), HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<DeleteResponse> deleteNursingReport(@PathVariable int id) {
        nursingReportService.deleteNursingReport(id);
        return new ResponseEntity<>(new DeleteResponse("Informe de enfermeria eliminado correctamente"), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<NursingReportResponse>> findNursingReports(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer trimester) {

        List<NursingReportResponse> reports = nursingReportService.findNursingReports(year, trimester);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<InputStreamResource> downloadNursingReport(@PathVariable int id) {
        ByteArrayInputStream excelStream = nursingReportService.downloadNursingReport(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=informe_enfermeria" + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelStream));

    }

    @GetMapping("list")
    public ResponseEntity<Page<NursingReportResponse>> listNursingReports(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        Page<NursingReportResponse> reports = nursingReportService.listNursingReports(pageable);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

}
