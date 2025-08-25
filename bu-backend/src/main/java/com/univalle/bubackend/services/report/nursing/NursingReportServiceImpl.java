package com.univalle.bubackend.services.report.nursing;

import com.univalle.bubackend.DTOs.nursing.NursingReportRequest;
import com.univalle.bubackend.DTOs.nursing.NursingReportResponse;
import com.univalle.bubackend.exceptions.report.InvalidDateFormat;
import com.univalle.bubackend.exceptions.report.ReportAlreadyExistsException;
import com.univalle.bubackend.exceptions.report.ReportNotFound;
import com.univalle.bubackend.models.Diagnostic;
import com.univalle.bubackend.models.NursingActivityLog;
import com.univalle.bubackend.models.NursingReport;
import com.univalle.bubackend.models.NursingReportDetail;
import com.univalle.bubackend.repository.NursingActivityRepository;
import com.univalle.bubackend.repository.ReportNursingRepository;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NursingReportServiceImpl implements INursingReportService {

    private NursingActivityRepository nursingActivityRepository;
    private ReportNursingRepository reportNursingRepository;

    @Override
    public NursingReportResponse generateNursingReport(NursingReportRequest request) {

        int trimester = request.trimester();
        if (trimester < 1 || trimester > 4) {
            throw new InvalidDateFormat("El trimestre debe ser un número entero entre 1 y 4");
        }

        int year = request.year();

        Optional<NursingReport> nursingReportOptional = reportNursingRepository.findNursingReportByYearAndTrimester(year, trimester);

        if (nursingReportOptional.isPresent()) {
            throw  new ReportAlreadyExistsException("Ya existe un informe con esa fecha");
        }

        LocalDate startDate = LocalDate.of(request.year(), (trimester - 1) * 3 + 1, 1);
        LocalDate endDate = startDate.plusMonths(3).minusDays(1);

        List<NursingActivityLog> activitiesTrimester = nursingActivityRepository
                .findAllByDateBetween(startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));

        int totalActivities = activitiesTrimester.size();

        NursingReport report = new NursingReport();
        report.setDate(LocalDate.now());
        report.setYear(request.year());
        report.setTrimester(trimester);
        report.setTotalActivities(totalActivities);

        // Contar el número de ocurrencias de cada diagnóstico
        Map<Diagnostic, Integer> diagnosticCountMap = new HashMap<>();
        for (NursingActivityLog activity : activitiesTrimester) {
            diagnosticCountMap.merge(activity.getDiagnostic(), 1, Integer::sum);
        }

        // Convertir el Map en una lista de NursingReportDetail y asignarla al informe
        List<NursingReportDetail> details = diagnosticCountMap.entrySet().stream()
                .map(entry -> {
                    NursingReportDetail detail = new NursingReportDetail();
                    detail.setDiagnostic(entry.getKey());
                    detail.setCount(entry.getValue());
                    detail.setNursingReport(report); // Relacionar con el informe actual
                    return detail;
                })
                .collect(Collectors.toList());

        report.setDiagnosticCount(details);
        report.setActivities(activitiesTrimester);

        // Guardar el informe con sus detalles
        reportNursingRepository.save(report);

        // Convertir los detalles a un Map para el DTO
        Map<Diagnostic, Integer> diagnosticCountMapForResponse = details.stream()
                .collect(Collectors.toMap(NursingReportDetail::getDiagnostic, NursingReportDetail::getCount));

        return new NursingReportResponse(report, diagnosticCountMapForResponse, totalActivities);
    }



    @Override
    public NursingReportResponse getNursingReport(Integer id) {

        NursingReport report = reportNursingRepository.findById(id)
                .orElseThrow(() -> new ReportNotFound("Informe de enfermeria no encontrado"));

        // Convertir la lista de NursingReportDetail a un Map<Diagnostic, Integer>
        Map<Diagnostic, Integer> diagnosticCounts = report.getDiagnosticCount().stream()
                .collect(Collectors.toMap(NursingReportDetail::getDiagnostic, NursingReportDetail::getCount));

        return new NursingReportResponse(report, diagnosticCounts, report.getTotalActivities());
    }

    @Override
    public void deleteNursingReport(Integer id) {
        if (!reportNursingRepository.existsById(id)){
            throw new ReportNotFound("Informe de enfermeria no encontrado");
        }
        reportNursingRepository.deleteById(id);
    }

    @Override
    public List<NursingReportResponse> findNursingReports(Integer year, Integer trimester) {
        List<NursingReport> reports;

        if (year != null && trimester != null) {
            // Buscar por año y trimestre específico
            reports = reportNursingRepository.findByYearAndTrimester(year, trimester);
        } else if (year != null) {
            // Buscar solo por año
            reports = reportNursingRepository.findByYear(year);
        } else {
            // Si no se especifica ningún parámetro, devuelve todos los informes
            reports = reportNursingRepository.findAll();
        }

        // Convierte a NursingReportResponse
        return reports.stream()
                .map(report -> new NursingReportResponse(report,
                        report.getDiagnosticCount().stream()
                                .collect(Collectors.toMap(NursingReportDetail::getDiagnostic, NursingReportDetail::getCount)),
                        report.getActivities().size()))
                .collect(Collectors.toList());
    }


    @Override
    public ByteArrayInputStream downloadNursingReport(Integer id) {
        NursingReport nursingReport = reportNursingRepository.findById(id)
                .orElseThrow(() -> new ReportNotFound("Informe de enfermería no encontrado"));

        // Formato para las fechas
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Informe de enfermería");

            // Crear estilos
            CellStyle boldStyle = workbook.createCellStyle();
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldFont.setFontHeightInPoints((short) 12);
            boldStyle.setFont(boldFont);

            CellStyle grayHeaderStyle = workbook.createCellStyle();
            grayHeaderStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            grayHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            grayHeaderStyle.setFont(boldFont);
            grayHeaderStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle normalStyle = workbook.createCellStyle();
            Font normalFont = workbook.createFont();
            normalFont.setFontHeightInPoints((short) 12);
            normalStyle.setFont(normalFont);

            // Información del informe (encabezado)
            Row headerRow = sheet.createRow(0);
            Cell cell = headerRow.createCell(0);
            cell.setCellValue("Fecha");
            cell.setCellStyle(boldStyle);

            cell = headerRow.createCell(1);
            cell.setCellValue(nursingReport.getDate().toString());
            cell.setCellStyle(normalStyle);

            cell = headerRow.createCell(2);
            cell.setCellValue("Informe");
            cell.setCellStyle(boldStyle);

            cell = headerRow.createCell(3);
            cell.setCellValue(nursingReport.getYear() + "-" + nursingReport.getTrimester());
            cell.setCellStyle(normalStyle);

            // Espacio entre secciones
            sheet.createRow(1);

            // Tabla 1: Información de los diagnósticos
            Row reportHeader = sheet.createRow(2);
            Cell headerCell = reportHeader.createCell(0);
            headerCell.setCellValue("Motivo");
            headerCell.setCellStyle(grayHeaderStyle);

            headerCell = reportHeader.createCell(1);
            headerCell.setCellValue("Cantidad");
            headerCell.setCellStyle(grayHeaderStyle);

            int rowNum = 3;
            for (NursingReportDetail detail : nursingReport.getDiagnosticCount()) {
                Row row = sheet.createRow(rowNum++);

                String formattedDiagnostic = detail.getDiagnostic()
                        .toString()
                        .toLowerCase()
                        .replace("_", " ");
                formattedDiagnostic = Character.toUpperCase(formattedDiagnostic.charAt(0)) + formattedDiagnostic.substring(1);

                Cell diagnosticCell = row.createCell(0);
                diagnosticCell.setCellValue(formattedDiagnostic);
                diagnosticCell.setCellStyle(normalStyle);

                Cell countCell = row.createCell(1);
                countCell.setCellValue(detail.getCount());
                countCell.setCellStyle(normalStyle);
            }

            // Espacio entre tablas
            rowNum++;

            // Tabla 2: Información de las actividades realizadas
            Row activityHeader = sheet.createRow(rowNum++);
            String[] activityHeaders = {
                    "Fecha", "Codigo/CC", "Nombre", "Apellido", "Teléfono", "Plan", "Semestre", "Género", "Diagnóstico", "Conducta"
            };

            for (int i = 0; i < activityHeaders.length; i++) {
                Cell activityHeaderCell = activityHeader.createCell(i);
                activityHeaderCell.setCellValue(activityHeaders[i]);
                activityHeaderCell.setCellStyle(grayHeaderStyle);
            }

            // Poblar filas con actividades
            for (NursingActivityLog activity : nursingReport.getActivities()) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(activity.getDate().format(dateFormatter));
                row.createCell(1).setCellValue(activity.getUser().getUsername());
                row.createCell(2).setCellValue(activity.getUser().getName());
                row.createCell(3).setCellValue(activity.getUser().getLastName());
                row.createCell(4).setCellValue(activity.getUser().getPhone() != null ? activity.getUser().getPhone().toString() : "");
                row.createCell(5).setCellValue(activity.getUser().getPlan());
                row.createCell(6).setCellValue(activity.getUser().getSemester());
                row.createCell(7).setCellValue(activity.getUser().getGender() != null ? activity.getUser().getGender().name() : "");
                String formattedDiagnostic = activity.getDiagnostic()
                        .toString()
                        .toLowerCase()
                        .replace("_", " ");
                formattedDiagnostic = Character.toUpperCase(formattedDiagnostic.charAt(0)) + formattedDiagnostic.substring(1);
                row.createCell(8).setCellValue(formattedDiagnostic);
                row.createCell(9).setCellValue(activity.getConduct());
            }

            // Ajustar ancho de columnas automáticamente
            for (int i = 0; i < activityHeaders.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Error al generar el archivo Excel", e);
        }
    }



    @Override
    public Page<NursingReportResponse> listNursingReports(Pageable pageable) {

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<NursingReport> nursingReports = reportNursingRepository.findAll(sortedPageable);

        return nursingReports.map(nursingReport -> NursingReportResponse.builder()
                .date(nursingReport.getDate())
                .year(nursingReport.getYear())
                .trimester(nursingReport.getTrimester())
                .id(nursingReport.getId())
                .build()
        );
    }

}
