package com.univalle.bubackend.services.appointment.validations;

import com.univalle.bubackend.exceptions.appointment.NotValidTypeAppointment;
import com.univalle.bubackend.models.TypeAppointment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Component
public class IsValidTypeAppointment {

    public void validateTypeAppointment(String typeAppointment) {

        List<String> listaEnum = Arrays.stream(TypeAppointment.values())
                .map(Enum::toString).toList();

        if(!listaEnum.contains(typeAppointment.toUpperCase())) {
            throw new NotValidTypeAppointment("Debes ingresar un tipo de cita válido");
        }

    }
}
