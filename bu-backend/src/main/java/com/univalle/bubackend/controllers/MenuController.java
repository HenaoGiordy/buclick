package com.univalle.bubackend.controllers;

import com.univalle.bubackend.DTOs.menu.CreateMenuRequest;
import com.univalle.bubackend.services.menu.IMenuService;
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
@RequestMapping("/menu")
@AllArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "Security Token")
public class MenuController {
    private IMenuService menuService;

    @Operation(
            summary = "Crear menu",
            description = "Permite crear el menu de refrigerio y almuerzo",
            tags = {"Menu"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = CreateMenuRequest.class)
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = CreateMenuRequest.class))}),
            @ApiResponse(responseCode = "400", description = "Error de validación en la solicitud",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @PostMapping
    public ResponseEntity<CreateMenuRequest> createMenu(@RequestBody CreateMenuRequest createMenuRequest) {
        return new ResponseEntity<>(menuService.createMenu(createMenuRequest), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Obtiene los dos menu",
            description = "Muestra el menu de almuerzo y refrigerio que fueron creados, debido a que solo se crean dos se muestra unicamente esos",
            tags = {"Menu"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = CreateMenuRequest.class))}),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @GetMapping
    public ResponseEntity<List<CreateMenuRequest>> getMenu() {
        return new ResponseEntity<>(menuService.getMenu(), HttpStatus.OK);
    }

    @Operation(
            summary = "Edita el menu",
            description = "Permite editar los menus anteriormente creados",
            tags = {"Menu"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = CreateMenuRequest.class)
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = CreateMenuRequest.class))}),
            @ApiResponse(responseCode = "404", description = "Menu no encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @PutMapping
    public ResponseEntity<CreateMenuRequest> editMenu(@Valid @RequestBody CreateMenuRequest createMenuRequest) {
        return new ResponseEntity<>(menuService.editMenu(createMenuRequest), HttpStatus.OK);
    }

}
