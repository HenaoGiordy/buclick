package com.univalle.bubackend.DTOs.user;


import com.univalle.bubackend.models.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record EditUserRequest(@NotNull(message = "Debes proporcionar un Id") Integer id,
                              @NotBlank(message = "Debes proporcionar el username") String username,
                              @NotBlank(message = "Debes proporcionar el name") String name,
                              @NotBlank(message = "Debes proporcionar el LastName") String lastName,
                              @NotBlank(message = "Debes proporcionar el email") String email,
                              @NotBlank(message = "Debes proporcionar el plan") String plan,
                              String eps,
                              String semester,
                              Long phone,
                              @NotNull(message = "Debes proporcionar el si el usuario está activo") Boolean isActive,
                              @NotNull(message = "Debes indicar si el usuario es beneficiario de lunchBeneficiary") Boolean lunchBeneficiary,
                              @NotNull(message = "Debes indicar si el usuario es beneficiario de lunchBeneficiary") Boolean snackBeneficiary,
                              @NotEmpty(message = "Debe tener por lo menos un rol") Set<RoleName> roles
                              ) {
}
