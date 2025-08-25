package com.univalle.bubackend.controllers.appointment;

import com.univalle.bubackend.DTOs.appointment.*;
import com.univalle.bubackend.services.appointment.dates.IAppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/appointment")
@SecurityRequirement(name = "Security Token")
@PreAuthorize("hasAnyRole('ODONTOLOGO', 'ENFERMERO', 'PSICOLOGO')")
public class AppointmentController {

    private IAppointmentService appointmentService;

    @Operation(
            summary = "Crear una nueva fecha disponible",
            description = "Permite a un profesional crear una nueva fecha disponible para citas. Roles permitidos: ODONTOLOGO, ENFERMERO, PSICOLOGO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Fecha disponible creada exitosamente",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseAvailableDate.class))}),
            @ApiResponse(responseCode = "400", description = "Error de validación en la solicitud",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Usuario no autorizado para realizar esta operación",
                    content = @Content)
    })
    @PostMapping("/create-date")
    public ResponseEntity<ResponseAvailableDate> createDate(@Valid @RequestBody RequestAvailableDate requestAvailableDate) {
        return new ResponseEntity<>(appointmentService.availableDatesAssign(requestAvailableDate), HttpStatus.CREATED);
    }


    @Operation(
            summary = "Obtener todos los horarios",
            description = "Permite obtener todos los horarios permitidos de un profesional. Roles permitidos: ODONTOLOGO, ENFERMERO, PSICOLOGO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseAllAvailableDates.class))}),
            @ApiResponse(responseCode = "400", description = "Error de validación en la solicitud",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Usuario no autorizado para realizar esta operación",
                    content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResponseAllAvailableDates> getAllAvailableDatesProfessional(@PathVariable Integer id) {
        return new ResponseEntity<>(appointmentService.getAllDatesProfessional(id), HttpStatus.OK);
    }

    @Operation(
            summary = "Borrar un horario disponible del profesional",
            description = "Permite eliminar un horario disponible de un profesional. Roles permitidos: ODONTOLOGO, ENFERMERO, PSICOLOGO."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDeleteAvailableDate.class))}),
            @ApiResponse(responseCode = "400", description = "Error de validación en la solicitud",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Usuario no autorizado para realizar esta operación",
                    content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDeleteAvailableDate> deleteDate(@PathVariable Integer id) {
        return new ResponseEntity<>(appointmentService.deleteAvailableDate(id), HttpStatus.OK);
    }

    @Operation(
            summary = "Obtener todos los horarios disponibles de citas",
            description = "Permite obtener todos los horarios de citas por su tipo, [ENFERMERIA, PSICOLOGIA, ODONTOLOGIA]"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseAllDatesType.class))}),
            @ApiResponse(responseCode = "400", description = "Error de validación en la solicitud",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Usuario no autorizado para realizar esta operación",
                    content = @Content)
    })

    @GetMapping("/all-dates/{studentId}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'ODONTOLOGO', 'ENFERMERO', 'PSICOLOGO', 'FUNCIONARIO')")
    public ResponseEntity<ResponseAllDatesType> getAllAvailableDatesType(@RequestParam String type, @PathVariable Integer studentId) {
        return new ResponseEntity<>(appointmentService.getAllAvailableDatesType(type, studentId), HttpStatus.OK);
    }

    @DeleteMapping("/delete-dates")
    public ResponseEntity<?> deleteDates(@RequestBody AvailableDatesListDTO availableDatesListDTO) {
        appointmentService.deleteAllDatesPerDate(availableDatesListDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
