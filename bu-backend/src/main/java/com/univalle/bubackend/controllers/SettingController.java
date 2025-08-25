package com.univalle.bubackend.controllers;

import com.univalle.bubackend.DTOs.setting.SettingRequest;
import com.univalle.bubackend.DTOs.setting.SettingResponse;
import com.univalle.bubackend.services.setting.ISettingService;
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

import java.util.List;

@RestController
@RequestMapping("/setting")
@AllArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "Security Token")
public class SettingController {

    private ISettingService settingService;

    @PostMapping
    @Operation(
            summary = "Crear ajuste de becas",
            description = "Gestiona el inicio y fin del semestre además de los tiempos de acceso y cantidad en las becas.",
            tags = {"Ajustes"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = SettingRequest.class)
                    )
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Ajustes creados exitosamente",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = SettingResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<SettingResponse> createSetting(@RequestBody SettingRequest settingRequest) {
        return new ResponseEntity<>(settingService.createSetting(settingRequest), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Obtiene el unico ajuste que se crea",
            description = "Muestra el ajuste que fue creado, debido a que solo se crea uno se muestra unicamente ese",
            tags = {"Ajustes"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = SettingResponse.class))}),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @GetMapping
    public ResponseEntity<List<SettingResponse>> getSetting() {
        return new ResponseEntity<>(settingService.getSetting(), HttpStatus.OK);
    }

    @Operation(
            summary = "Edita el ajuste de becas",
            description = "Permite editar el ajuste anteriormente creado",
            tags = {"Ajustes"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = SettingRequest.class)
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ajustes actualizados exitosamente",
                    content = {@Content(mediaType = "application/json",
                    schema = @Schema(implementation = SettingResponse.class))}),
            @ApiResponse(responseCode = "404", description = "Ajuste no encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @PutMapping
    public ResponseEntity<SettingResponse> editSetting(@Valid @RequestBody SettingRequest settingRequest) {
        return new ResponseEntity<>(settingService.editSetting(settingRequest), HttpStatus.OK);
    }


}
