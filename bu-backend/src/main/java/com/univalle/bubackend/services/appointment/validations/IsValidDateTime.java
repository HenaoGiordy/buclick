package com.univalle.bubackend.services.appointment.validations;

import com.univalle.bubackend.exceptions.appointment.HasDatesPending;
import com.univalle.bubackend.models.AvailableDates;
import com.univalle.bubackend.repository.AvailableDatesRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class IsValidDateTime implements DateTimeValidation{
  private AvailableDatesRepository availableDatesRepository;

    @Override
    public void validateDateTime(String dateTime, Integer professionaId) {
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        LocalDateTime fechaReferencia = LocalDateTime.parse(dateTime, formatter);
          LocalDateTime fechaInicio = fechaReferencia.minusMinutes(30);
          LocalDateTime fechaFin = fechaReferencia.plusMinutes(30);

          Optional<List<AvailableDates>> eventosOp = availableDatesRepository.findEventosWithin30Minutes(fechaInicio, fechaFin, professionaId);
          List<AvailableDates> eventos = eventosOp.orElseGet(ArrayList::new);

          if(!eventos.isEmpty()) {
              throw new HasDatesPending("Ya tienes una cita programada 30 min antes o después de este horario");
          }
  }
}
