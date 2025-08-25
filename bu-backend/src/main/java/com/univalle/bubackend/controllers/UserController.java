package com.univalle.bubackend.controllers;

import com.univalle.bubackend.DTOs.report.DeleteResponse;
import com.univalle.bubackend.DTOs.user.*;
import com.univalle.bubackend.models.RoleName;
import com.univalle.bubackend.services.user.UserDetailServiceImpl;
import com.univalle.bubackend.services.user.UserServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@SecurityRequirement(name = "Security Token")
public class UserController {

    private final UserServiceImpl userService;
    private final UserDetailServiceImpl userDetailServiceImpl;

    public UserController(UserServiceImpl userService, UserDetailServiceImpl userDetailServiceImpl) {
        this.userService = userService;
        this.userDetailServiceImpl = userDetailServiceImpl;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Validated @RequestBody UserRequest userRequest) {
        return new ResponseEntity<>(userService.createUser(userRequest), HttpStatus.CREATED);
    }

    @GetMapping("/search/{username}")
    public ResponseEntity<UserResponse> searchStudentsByCode(@PathVariable String username) {
        return new ResponseEntity<>(userService.findStudentsByUsername(username), HttpStatus.OK);
    }

    @Operation(
            summary = "Buscar usuarios por código y tipo",
            description = "Permite buscar usuarios por su código de usuario y un filtro de tipo. " +
                    "Los filtros válidos son: 'beneficiarios', 'estudiantes' y 'funcionarios'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponse.class))}),
            @ApiResponse(responseCode = "400", description = "Filtro no válido",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado o filtro restringido",
                    content = @Content)
    })
    @GetMapping("/search")
    public ResponseEntity<UserResponse> searchUsersByCode(
            @Parameter(description = "Código del usuario (username) para buscar.", required = true, example = "12345")
            @RequestParam String username,

            @Parameter(description = "Filtro de búsqueda. Valores posibles: 'beneficiarios', 'estudiantes', 'funcionarios'.", required = true, example = "estudiantes")
            @RequestParam String type
    ) {
        return ResponseEntity.ok(userService.findUsersByUsername(username, type));
    }


    @PutMapping("/edit")
    public ResponseEntity<EditUserResponse> editUser(@Valid @RequestBody EditUserRequest editUserRequest) {
        return new ResponseEntity<>(userService.editUser(editUserRequest), HttpStatus.OK);
    }

    @Operation(
            summary = "Importar usuarios",
            description = "Permite importar usuarios usando un formato csv",
            tags = {"Usuarios"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponse.class))}),
            @ApiResponse(responseCode = "400", description = "Error en el archivo CSV:",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "file",
            description = "Debes ingresar el archivo csv",
            required = true,
            example = "file"
    )
    @Parameter(
            name = "role",
            description = "Debes ingresar el rol de los usuarios",
            required = true,
            example = "?role=ESTUDIANTE"
    )
    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<UserResponse>> importUser(@RequestParam("file") MultipartFile file,
                                                         @RequestParam("role") RoleName roleName) {
        List<UserResponse> users = userService.importUsers(file, roleName);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @Operation(
            summary = "Cambiar contraseña",
            description = "Permite al usuario cambiar su contraseña",
            tags = {"Usuarios"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = PasswordRequest.class)
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña cambiada con exito",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = PasswordResponse.class))}),
            @ApiResponse(responseCode = "400", description = "La contraseña actual es incorrecta o Las contraseñas no coinciden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "No se encontró el usuario",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @PostMapping("/changePassword")
    public ResponseEntity<PasswordResponse> changePassword(@Valid @RequestBody PasswordRequest passwordRequest) {
        return new ResponseEntity<>(userService.changePassword(passwordRequest), HttpStatus.OK);
    }

    @Operation(
            summary = "Listar usuarios",
            description = "Permite listar los usuarios de acuerdo a si es funcionarios, beneficiarios o estudiantes",
            tags = {"Usuarios"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ListUser.class))}),
            @ApiResponse(responseCode = "400", description = "Filtro no válido",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "filter",
            description = "Debes ingresar si son beneficiarios, funcionarios o estudiantes",
            required = true,
            example = "?filter=beneficiarios"
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
        public ResponseEntity<Page<ListUser>> getAllUsers(@PageableDefault(size = 10, page = 0) Pageable page,
                @RequestParam(value = "filter") String filter) {


        Page<ListUser> users = userService.listUsers(filter, page);

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @Operation(
            summary = "Eliminar todos los beneficiarios",
            description = "Permite eliminar a todos los beneficiarios a la vez",
            tags = {"Usuarios"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Beneficiarios eliminados correctamente",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = DeleteResponse.class))}),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @PutMapping("/delete")
    public ResponseEntity<DeleteResponse> removeBeneficiaries() {
        userService.deleteBeneficiaries();
        return new ResponseEntity<>(new DeleteResponse("Beneficiarios eliminados correctamente"), HttpStatus.OK);
    }

    @Operation(
            summary = "Eliminar beneficiario",
            description = "Permite borrar un beneficiarios de forma individual",
            tags = {"Usuarios"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Beneficiario borrado exitosamente",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = DeleteResponse.class))}),
            @ApiResponse(responseCode = "404", description = "No se encontro el usuario",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado o token inválido",
                    content = @Content)
    })
    @Parameter(
            name = "username",
            description = "Debes ingresar el username del beneficiario a eliminar",
            required = true,
            example = "202244321"
    )
    @PutMapping("/delete/{username}")
    public ResponseEntity<DeleteResponse> removeBeneficiary(@PathVariable String username ) {
        userService.deleteBeneficiary(username);
        return new ResponseEntity<>(new DeleteResponse("Beneficiario borrado exitosamente"), HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<ViewProfileResponse> getUserBenefits(@PathVariable String username) {
        ViewProfileResponse userBenefits = userDetailServiceImpl.getUserDetails(username);
        return ResponseEntity.ok(userBenefits);

    }


}
