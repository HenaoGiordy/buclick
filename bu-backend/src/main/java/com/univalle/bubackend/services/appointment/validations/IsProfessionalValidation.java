package com.univalle.bubackend.services.appointment.validations;

import com.univalle.bubackend.exceptions.appointment.NotProfessional;
import com.univalle.bubackend.models.RoleName;
import com.univalle.bubackend.models.UserEntity;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Set;

@Component
public class IsProfessionalValidation implements AppointmentDateCreationValidation{

    private final Set<RoleName> acceptableRoles = EnumSet.of(RoleName.PSICOLOGO, RoleName.ENFERMERO, RoleName.ODONTOLOGO);

    @Override
    public void validateIsProfessional(UserEntity professional) {
        if(professional.getRoles().stream().noneMatch(role -> acceptableRoles.contains(role.getName()))){
            throw new NotProfessional("Debes ser un profesional para asignar un horario" + acceptableRoles);
        }
    }
}
