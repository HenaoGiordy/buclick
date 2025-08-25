package com.univalle.bubackend.DTOs.appointment;

import com.univalle.bubackend.models.Role;
import com.univalle.bubackend.models.UserEntity;
import org.springframework.data.domain.Page;

import java.util.Set;

public record UserResponseAppointment(
        Integer id,
        String username,
        String name,
        String email,
        String eps,
        String semester,
        Long phone,
        String plan,
        Set<Role>roles,
        boolean isActive,
        Page<ListReservationResponse> listReservation

) {
    public UserResponseAppointment(UserEntity userEntity, Page<ListReservationResponse> listReservation) {
        this(
                userEntity.getId(),
                userEntity.getUsername(),
                userEntity.getName(),
                userEntity.getEmail(),
                userEntity.getEps(),
                userEntity.getSemester(),
                userEntity.getPhone(),
                userEntity.getPlan(),
                userEntity.getRoles(),
                userEntity.getIsActive(),
                listReservation
        );
    }
}