package com.univalle.bubackend.services.appointment.validations;

import com.univalle.bubackend.models.Role;
import com.univalle.bubackend.models.RoleName;
import com.univalle.bubackend.models.TypeAppointment;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;

@Component
public class DefineTypeOfAppointment {

    public TypeAppointment defineTypeOfAppointment(Set<Role> roles) {
        TypeAppointment typeAppointment = null;
        RoleName roleName = roles.stream()
                .findFirst()
                .map(Role::getName)
                .orElse(null);

        switch (Objects.requireNonNull(roleName)) {
            case ENFERMERO:
                typeAppointment = TypeAppointment.ENFERMERIA;
                break;

            case ODONTOLOGO:
                typeAppointment = TypeAppointment.ODONTOLOGIA;
                break;

            case PSICOLOGO:
                typeAppointment = TypeAppointment.PSICOLOGIA;
                break;

            default:
                break;
        }

        return typeAppointment;
    }
}
