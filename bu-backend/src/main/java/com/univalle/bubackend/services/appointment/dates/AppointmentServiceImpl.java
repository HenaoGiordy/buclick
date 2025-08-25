package com.univalle.bubackend.services.appointment.dates;

import com.univalle.bubackend.DTOs.appointment.*;
import com.univalle.bubackend.DTOs.user.UserEntityDTO;
import com.univalle.bubackend.exceptions.appointment.NoAvailableDateFound;
import com.univalle.bubackend.exceptions.appointment.HasNoAvailableDates;
import com.univalle.bubackend.exceptions.change_password.UserNotFound;
import com.univalle.bubackend.models.AppointmentReservation;
import com.univalle.bubackend.models.AvailableDates;
import com.univalle.bubackend.models.TypeAppointment;
import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.repository.AppointmentReservationRepository;
import com.univalle.bubackend.repository.AvailableDatesRepository;
import com.univalle.bubackend.repository.UserEntityRepository;
import com.univalle.bubackend.services.appointment.validations.AppointmentDateCreationValidation;
import com.univalle.bubackend.services.appointment.validations.DateTimeValidation;
import com.univalle.bubackend.services.appointment.validations.IsValidTypeAppointment;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements IAppointmentService {

    private AvailableDatesRepository availableDatesRepository;
    private UserEntityRepository userEntityRepository;
    private AppointmentReservationRepository appointmentReservationRepository;
    private AppointmentDateCreationValidation appointmentDateCreationValidations;
    private TaskScheduler taskScheduler;
    private IsValidTypeAppointment isValidTypeAppointment;
    private DateTimeValidation isValidDateTime;

    @Override
    public ResponseAvailableDate availableDatesAssign(RequestAvailableDate requestAvailableDate) {
        UserEntity professional = userEntityRepository.findById(requestAvailableDate.professionalId()).orElseThrow(
                () -> new UserNotFound("No se encontró un usuario")
        );


        appointmentDateCreationValidations.validateIsProfessional(professional);

        requestAvailableDate.availableDates().forEach(
                x -> {
                    isValidTypeAppointment.validateTypeAppointment(x.typeAppointment().toUpperCase());
                    isValidDateTime.validateDateTime(x.dateTime().toString(), x.professionalId());

    });



        List<AvailableDates> dates = requestAvailableDate.availableDates().stream().map(x ->
                                AvailableDates.builder()
                                        .dateTime(x.dateTime())
                                        .typeAppointment(TypeAppointment.valueOf(x.typeAppointment().toUpperCase()))
                                        .professional(professional)
                                        .build())
                                        .toList();



        availableDatesRepository.saveAll(dates);
        dates.forEach(x -> taskScheduler.schedule(()->{
                Instant scheduledInstant = convertToInstant(x.getDateTime());
                log.info("Scheduled task for: {} Current time: {}", scheduledInstant, Instant.now());
                if(x.getAvailable()){
                    availableDatesRepository.delete(x);
                }
            }, convertToInstant(x.getDateTime()))
        );
        List<AvailableDateDTO> dateDTOS = dates.stream().map(AvailableDateDTO::new).toList();

        return new ResponseAvailableDate("Se crearon las citas", professional.getId(), dateDTOS);
    }

    private Instant convertToInstant(LocalDateTime localDateTime) {
        ZoneId zoneId = ZoneId.systemDefault();
        return localDateTime.atZone(zoneId).toInstant();
    }

    @Override
    public ResponseAllAvailableDates getAllDatesProfessional(Integer professionalId) {
        Optional<UserEntity> professional = userEntityRepository.findById(professionalId);
        Optional<List<AvailableDates>> datesOp = availableDatesRepository.findByProfessionalId(professionalId);
        List<AvailableDates> dates = datesOp.orElseThrow(()->new HasNoAvailableDates("El profesional no tiene horarios disponibles"));

        List<AvailableDateDTO> dateDTOS = dates.stream().map(AvailableDateDTO::new).toList();
        UserEntity userEntity = professional.orElseThrow(()->new UserNotFound("No se encontro un usuario"));

        UserEntityDTO userEntityDTO = new UserEntityDTO(userEntity);
        return new ResponseAllAvailableDates(dateDTOS, userEntityDTO);
    }

    @Override
    public ResponseDeleteAvailableDate deleteAvailableDate(Integer id) {
        Optional<AvailableDates> availableDatesOpt = availableDatesRepository.findById(id);
        AvailableDates availableDates = availableDatesOpt.orElseThrow(() -> new NoAvailableDateFound("No se encontró el horario"));
        availableDatesRepository.delete(availableDates);
        return new ResponseDeleteAvailableDate("Se eliminó el horario", new AvailableDateDTO(availableDates));
    }

    @Override
    public ResponseAllDatesType getAllAvailableDatesType(String type, Integer studendId) {
        isValidTypeAppointment.validateTypeAppointment(type);

        TypeAppointment typeAppointment = TypeAppointment.valueOf(type.toUpperCase());

        if(typeAppointment.equals(TypeAppointment.PSICOLOGIA)){
            List<AppointmentReservation> lista = appointmentReservationRepository.findByEstudiante_IdAndAvailableDates_TypeAppointment(studendId, TypeAppointment.PSICOLOGIA);

            if(!lista.isEmpty()){
                Integer professionaId = lista.stream()
                        .map(appointment -> appointment.getAvailableDates().getProfessional().getId()) // Obtener el ID del profesional
                        .findFirst().orElseThrow();
                Optional<List<AvailableDates>> datesOp = availableDatesRepository.findByTypeAppointmentAndAvailableTrueAndProfessional_Id(typeAppointment, professionaId);
                List<AvailableDates> datesType = datesOp.orElseGet(ArrayList::new);
                List<AvailableDateDTO> dateDTOS = datesType.stream().map(AvailableDateDTO::new).toList();
                return new ResponseAllDatesType(type.toUpperCase() ,dateDTOS);
            }
        }

        Optional<List<AvailableDates>> datesOp = availableDatesRepository.findByTypeAppointmentAndAvailableTrue(typeAppointment);
        List<AvailableDates> datesType = datesOp.orElseGet(ArrayList::new);

        List<AvailableDateDTO> dateDTOS = datesType.stream().map(AvailableDateDTO::new).toList();

        return new ResponseAllDatesType(type.toUpperCase() ,dateDTOS);
    }

    @Override
    public void deleteAllDatesPerDate(AvailableDatesListDTO availableDatesListDTO) {
        String specificDate = availableDatesListDTO.date();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate date;
        try {
            date = LocalDate.parse(specificDate, formatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("La fecha proporcionada no tiene el formato correcto: dd/MM/yyyy");
        }
        availableDatesRepository.deleteAllBySpecificDate(date);
    }
}
