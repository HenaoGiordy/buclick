package com.univalle.bubackend.DTOs.user;

import com.univalle.bubackend.models.Role;
import com.univalle.bubackend.models.UserEntity;

import java.util.Set;

public record UserResponse(
        Integer id,
        String username,
        String name,
        String lastName,
        String email,
        String eps,
        String semester,
        Long phone,
        String plan,
        Set<Role>roles,
        boolean lunchBeneficiary,
        boolean snackBeneficiary,
        boolean isActive
) {
    public UserResponse(UserEntity userEntity) {
        this(
                userEntity.getId(),
                userEntity.getUsername(),
                userEntity.getName(),
                userEntity.getLastName(),
                userEntity.getEmail(),
                userEntity.getEps(),
                userEntity.getSemester(),
                userEntity.getPhone(),
                userEntity.getPlan(),
                userEntity.getRoles(),
                userEntity.getLunchBeneficiary(),
                userEntity.getSnackBeneficiary(),
                userEntity.getIsActive()
        );
    }
}