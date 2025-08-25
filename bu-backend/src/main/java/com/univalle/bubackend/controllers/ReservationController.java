package com.univalle.bubackend.controllers;

import com.univalle.bubackend.DTOs.payment.ReservationPaymentRequest;
import com.univalle.bubackend.DTOs.payment.ReservationPaymentResponse;
import com.univalle.bubackend.DTOs.reservation.*;
import com.univalle.bubackend.exceptions.ResourceNotFoundException;
import com.univalle.bubackend.exceptions.reservation.NoSlotsAvailableException;
import com.univalle.bubackend.exceptions.reservation.UnauthorizedException;
import com.univalle.bubackend.services.reservation.IReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@AllArgsConstructor
public class ReservationController {

    private final IReservationService reservationService;

    @Operation(summary = "Create a reservation for a student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reservation created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resource not found",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Unauthorized to make reservation",
                    content = @Content),
            @ApiResponse(responseCode = "409", description = "No slots available",
                    content = @Content)
    })
    @PostMapping("/create")
    public ResponseEntity<?> createStudentReservation(@Valid @RequestBody ReservationStudentRequest request) {
        try {
            ReservationResponse response = reservationService.createStudentReservation(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (NoSlotsAvailableException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @Operation(summary = "Create a reservation for an external user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reservation created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resource not found",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized to make reservation",
                    content = @Content),
            @ApiResponse(responseCode = "409", description = "No slots available",
                    content = @Content)
    })
    @PostMapping("/create-extern")
    public ResponseEntity<?> createExternReservation(@Valid @RequestBody ReservationExternRequest request) {
        try {
            ReservationResponse response = reservationService.createExternReservation(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (NoSlotsAvailableException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @Operation(summary = "Get availability for reservations")
    @ApiResponse(responseCode = "200", description = "Availability fetched successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AvailabilityResponse.class)))
    @GetMapping("/availability")
    public ResponseEntity<AvailabilityResponse> getAvailability() {
        AvailabilityResponse availability = reservationService.getAvailability();
        return ResponseEntity.ok(availability);
    }

    @Operation(summary = "Get availability per hour for reservations")
    @ApiResponse(responseCode = "200", description = "Availability per hour fetched successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AvailabilityPerHourResponse.class)))
    @GetMapping("/availability-per-hour")
    public ResponseEntity<AvailabilityPerHourResponse> getAvailabilityPerHour() {
        AvailabilityPerHourResponse availability = reservationService.getAvailabilityPerHour();
        return ResponseEntity.ok(availability);
    }

    @Operation(summary = "Get reservations by username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservations found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationResponse.class))),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content)
    })
    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> findReservationByUsername(@PathVariable String username) {
        try {
            List<ReservationResponse> responses = Collections.singletonList(reservationService.findReservationByUsername(username));
            return ResponseEntity.ok(responses);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(summary = "Register payment for reservation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment registered successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationPaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content)
    })
    @PutMapping("/register-payment")
    public ResponseEntity<?> registerPayment(@RequestBody ReservationPaymentRequest paymentRequest) {
        try {
            ReservationPaymentResponse response = reservationService.registerPayment(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Get all active reservations with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservations found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ListReservationResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    @GetMapping("/all")
    public ResponseEntity<?> getAllReservations(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        try {
            Page<ListReservationResponse> reservations = reservationService.getActiveReservations(pageable);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "Cancel a reservation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservation canceled successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Reservation not found",
                    content = @Content)
    })
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Integer id) {
        try {
            ReservationResponse response = reservationService.cancelReservation(id);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(summary = "Buscar Funcionario/Externo por username", description = "Obtiene el fucionario o externo por su username.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrada", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ExternResponse.class))),
            @ApiResponse(responseCode = "404", description = "usario no encontrada", content = @Content)
    })
    @GetMapping("/extern/{username}")
    public ResponseEntity<ExternResponse> findExternUsername(@PathVariable String username) {
        try {
            ExternResponse responses = reservationService.getExtern(username);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Obtener reservas por día", description = "Obtiene las reservas de un usuario para un día específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservas encontradas", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @GetMapping("/per-day/{username}")
    public ResponseEntity<List<ReservationResponse>> getReservationsPerDay(@PathVariable String username) {
        try {
            List<ReservationResponse> responses = reservationService.getReservationsPerDay(username);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
