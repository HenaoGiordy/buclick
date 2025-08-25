package com.univalle.bubackend.DTOs.user;

import com.univalle.bubackend.models.Role;
import lombok.Builder;

import java.util.Set;

@Builder
public record ListUser(
        Integer id,
        String username,
        String name,
        String lastName,
        String email,
        String plan,
        Boolean isActive,
        Boolean lunchBeneficiary,
        Boolean snackBeneficiary,
        Set<Role> roles) {
}
