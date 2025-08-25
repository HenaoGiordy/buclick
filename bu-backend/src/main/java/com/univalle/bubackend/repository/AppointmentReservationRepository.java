package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.AppointmentReservation;
import com.univalle.bubackend.models.TypeAppointment;
import com.univalle.bubackend.models.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentReservationRepository extends JpaRepository<AppointmentReservation, Integer> {
    Optional<List<AppointmentReservation>> findByAvailableDates_ProfessionalId(Integer id);
    Page<AppointmentReservation> findByAvailableDates_Professional_IdAndPendingAppointmentTrue(Integer id, Pageable pageable);

    Page<AppointmentReservation> findByAvailableDates_Professional_IdAndPendingAppointmentFalse(Integer id, Pageable pageable);

    List<AppointmentReservation> findByAvailableDates_Professional_IdAndPendingAppointmentFalse(Integer id);

    @Query("SELECT a FROM AppointmentReservation a " +
            "WHERE a.pendingAppointment = false " +
            "AND FUNCTION('DATE', a.availableDates.dateTime) = :specificDate " +
            "AND a.availableDates.professional.id = :professionalId")
    Page<AppointmentReservation> findAttendedAppointmentsBySpecificDate(
            @Param("specificDate") LocalDate specificDate,
            @Param("professionalId") Integer professionalId,
            Pageable pageable);

    List<AppointmentReservation> findByEstudiante_IdAndAvailableDates_TypeAppointment(Integer estudianteId, TypeAppointment typeAppointment);


    Optional<List<AppointmentReservation>> findByEstudiante_Id(Integer id);

    Optional<AppointmentReservation> findByEstudiante_IdAndPendingAppointmentTrueAndAvailableDates_TypeAppointment(Integer id, TypeAppointment type);

    @Query("SELECT COUNT(a) FROM AppointmentReservation a " +
            "WHERE a.estudiante = :id AND " +
            "a.availableDates.typeAppointment = :typeAppointment AND " +
            "a.assistant = true AND " +
            "a.availableDates.dateTime BETWEEN :startDate AND :endDate")
    Integer countAppointmentReservationByEstudiante_IdAndAvailableDates_DateTime(
            @Param("id") UserEntity id,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("typeAppointment") TypeAppointment typeAppointment);


    @Query("SELECT u FROM UserEntity u " +
            "JOIN AppointmentReservation ar ON ar.estudiante = u " +
            "JOIN ar.availableDates ad " +
            "WHERE u.username = :username " +
            "AND ad.typeAppointment = :typeAppointment " +
            "AND ar.availableDates.dateTime BETWEEN :startDate AND :endDate")
    Optional<UserEntity> findByUsernameWithPsychoReservation(
            @Param("username") String username,
            @Param("typeAppointment") TypeAppointment typeAppointment,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM AppointmentReservation a " +
            "WHERE a.estudiante.username = :username " +
            "AND a.assistant IS NOT NULL " +
            "AND a.availableDates.typeAppointment = :typeAppointment")
    Page<AppointmentReservation> getAllAppointmentReservationByUsername(
            Pageable pageable,
            @Param("username") String username,
            @Param("typeAppointment") TypeAppointment typeAppointment);
}
