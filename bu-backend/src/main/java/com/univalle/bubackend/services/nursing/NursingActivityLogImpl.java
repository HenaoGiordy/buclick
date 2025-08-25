package com.univalle.bubackend.services.nursing;

import com.univalle.bubackend.DTOs.nursing.ActivityLogRequest;
import com.univalle.bubackend.DTOs.nursing.ActivityLogResponse;
import com.univalle.bubackend.DTOs.nursing.ActivityNursingResponse;
import com.univalle.bubackend.DTOs.nursing.UserResponse;
import com.univalle.bubackend.DTOs.user.UserRequest;
import com.univalle.bubackend.exceptions.ResourceNotFoundException;
import com.univalle.bubackend.exceptions.change_password.UserNotFound;
import com.univalle.bubackend.exceptions.nursing.FieldException;
import com.univalle.bubackend.models.NursingActivityLog;
import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.repository.NursingActivityRepository;
import com.univalle.bubackend.repository.UserEntityRepository;
import com.univalle.bubackend.services.user.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class NursingActivityLogImpl implements INursingActivityLog {

    private final UserEntityRepository userEntityRepository;
    private final NursingActivityRepository nursingActivityLogRepository;
    private final UserServiceImpl userService;

    @Override
    public UserResponse findUserByUsername(String username) {
        Optional<UserEntity> optionalUser = userEntityRepository.findByUsername(username);
        UserEntity user = optionalUser.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return new UserResponse(user);
    }

    @Override
    public ActivityLogResponse registerActivity(ActivityLogRequest request) {

        Optional<UserEntity> userCondition = userEntityRepository.findByUsername(request.username());

        if (userCondition.isEmpty()) {
            Set<String> roles = Set.of("EXTERNO");
            UserRequest userRequest = new UserRequest(
                    request.username(),
                    request.name(),
                    request.lastname(),
                    null,
                    null,
                    request.plan(),
                    roles,
                    null
            );
            userService.createUser(userRequest);

        }

        UserEntity user = userEntityRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setPhone(request.phone());
        user.setSemester(request.semester());
        user.setGender(request.gender());
        userEntityRepository.save(user);

        NursingActivityLog nursingActivityLog = NursingActivityLog.builder()
                .user(user)
                .date(request.date().atStartOfDay())
                .diagnostic(request.diagnostic())
                .conduct(request.conduct())
                .build();

        nursingActivityLogRepository.save(nursingActivityLog);

        return new ActivityLogResponse(
                nursingActivityLog.getId(),
                nursingActivityLog.getDate().toLocalDate(),
                nursingActivityLog.getDate().toLocalTime(),
                user.getUsername(),
                user.getName() ,
                user.getLastName(),
                user.getPhone(),
                user.getPlan(),
                user.getSemester(),
                user.getGender(),
                nursingActivityLog.getDiagnostic(),
                nursingActivityLog.getConduct()
        );
    }

    @Override
    public List<ActivityNursingResponse> activitiesNursing(String username, LocalDate startDate, LocalDate endDate) {

        if (username == null && (startDate == null || endDate == null)) {
            throw new FieldException("Debe suministrar el codigo del usuario o el rango de fechas para realizar la búsqueda");
        }

        List<NursingActivityLog> activities;

        // Si ambos están presentes, filtrar por username y fecha
        if (username != null && startDate != null && endDate != null) {
            activities = nursingActivityLogRepository.findAllByUserUsernameAndDateBetweenOrderByIdDesc(
                    username, startDate.atStartOfDay(), endDate.atTime(LocalTime.MIDNIGHT));

            UserEntity user = userEntityRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFound("No se encontró el usuario"));

            if (activities.isEmpty()) {
                throw new ResourceNotFoundException("El usuario no tiene citas realizadas en esa fecha.");
            }

            // Solo por username
        } else if (username != null) {
            activities = nursingActivityLogRepository.findAllByUserUsernameOrderByIdDesc(username);

            if (activities.isEmpty()) {
                throw new ResourceNotFoundException("El usuario no tiene ningún registro de enfermería.");
            }

            // Solo por rango de fechas
        } else {
            activities = nursingActivityLogRepository.findAllByDateBetweenOrderByIdDesc(
                    startDate.atStartOfDay(), endDate.atTime(LocalTime.MIDNIGHT));
            if (activities.isEmpty()) {
                throw new ResourceNotFoundException("No existen registros de enfermería en la fecha suministrada.");
            }

        }

        return activities.stream()
                .map(activity -> new ActivityNursingResponse(
                        activity.getId(),
                        activity.getDate().toLocalDate(),
                        activity.getDate().toLocalTime(),
                        new UserResponse(activity.getUser()),
                        activity.getDiagnostic(),
                        activity.getConduct()
                ))
                .collect(Collectors.toList());
    }


    @Override
    public ActivityNursingResponse getActivityNursing(Integer id) {
        NursingActivityLog activity = nursingActivityLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actividad de enfermería no encontrada"));
        return new ActivityNursingResponse(activity);
    }
}
