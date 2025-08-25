package com.univalle.bubackend.DTOs.odontology;

import com.univalle.bubackend.models.UserEntity;


public record UserResponse(
        Integer id,
        String username,
        String name,
        String lastName,
        String plan
) {
    public UserResponse(UserEntity userEntity) {
        this(
                userEntity.getId(),
                userEntity.getUsername(),
                userEntity.getName(),
                userEntity.getLastName(),
                userEntity.getPlan()
        );
    }
}