package com.univalle.bubackend.controllers;

import com.univalle.bubackend.DTOs.report.DeleteResponse;
import com.univalle.bubackend.DTOs.report.ReportRequest;
import com.univalle.bubackend.DTOs.report.ReportResponse;
import com.univalle.bubackend.models.Report;
import com.univalle.bubackend.services.report.allowance.ReportServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/report")
@AllArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "Security Token")
public class ReportController {
    private final ReportServiceImpl reportService;

    @Operation(
            summary = "Generar informes",
            description = "Permite generar el informe diario y semestral",
            tags = {"Informes"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ReportRequest.class)
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Report.class))}),
            @ApiResponse(responseCode = "400", description = "Tipo de beca no valida",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @PostMapping
    public ResponseEntity<Report> generateReport(@RequestBody ReportRequest reportRequest) {
        return new ResponseEntity<>(reportService.generateReport(reportRequest), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Elimina el informe",
            description = "Permite eliminar el informe anteriormente creado",
            tags = {"Informes"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Informe eliminado correctamente",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = DeleteResponse.class))}),
            @ApiResponse(responseCode = "404", description = "Informe no encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "id",
            description = "Debes ingresar el Id del informe el cual quieres eliminar",
            required = true,
            example = "1"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DeleteResponse> deleteReport(@PathVariable Integer id) {
        reportService.deleteReport(id);
        return new ResponseEntity<>(new DeleteResponse("Informe eliminado correctamente."), HttpStatus.OK);
    }

    @Operation(
            summary = "Descargar el informe",
            description = "Permite descargar el informe en formato excel",
            tags = {"Informes"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = InputStreamResource.class))}),
            @ApiResponse(responseCode = "404", description = "Informe no encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "id",
            description = "Debes ingresar el Id del informe el cual quieres descargar",
            required = true,
            example = "1"
    )
    @GetMapping("/download/{id}")
    public ResponseEntity<InputStreamResource> downloadReport(@PathVariable Integer id) {
        ByteArrayInputStream excelStream = reportService.generateExcelReport(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=informe_beca" + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelStream));
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<Report>> getReportsBySemester(@PathVariable String semester) {
        return new ResponseEntity<>(reportService.findReportsBySemester(semester), HttpStatus.OK);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Report>> getReportsByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return new ResponseEntity<>(reportService.findReportsByDate(localDate), HttpStatus.OK);
    }

    @Operation(
            summary = "Ver el informe",
            description = "Permite ver en detalle el informe que escoja",
            tags = {"Informes"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ReportResponse.class))}),
            @ApiResponse(responseCode = "404", description = "Informe no encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "id",
            description = "Debes ingresar el Id del informe el cual quieres ver",
            required = true,
            example = "1"
    )
    @GetMapping("/viewReport/{id}")
    public ResponseEntity<ReportResponse> viewReport(@PathVariable Integer id) {
        return new ResponseEntity<>(reportService.viewReport(id), HttpStatus.OK);
    }

    @Operation(
            summary = "Listar informes",
            description = "Permite listar los informes de acuerdo a si es diario o semestral",
            tags = {"Informes"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ReportResponse.class))}),
            @ApiResponse(responseCode = "400", description = "Filtro no válido",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "filter",
            description = "Debes ingresar si es semestral o diario",
            required = true,
            example = "?filter=semester"
    )
    @Parameter(
            name = "page",
            description = "Debes ingresar que pagina vas a ver",
            required = true,
            example = "page=0"
    )
    @Parameter(
            name = "size",
            description = "Debes ingresar cuantos elementos se listaran",
            required = false,
            example = "size=10"
    )
    @GetMapping("/list")
    public ResponseEntity<Page<ReportResponse>> getReports(@PageableDefault(size = 10, page = 0) Pageable page,
            @RequestParam(value = "filter", required = true) String filter) {

        Page<ReportResponse> reports = reportService.listReports(filter, page);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }


}
