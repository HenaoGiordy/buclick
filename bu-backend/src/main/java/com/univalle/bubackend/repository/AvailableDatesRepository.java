package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.AvailableDates;
import com.univalle.bubackend.models.TypeAppointment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailableDatesRepository extends JpaRepository<AvailableDates, Integer> {
    Optional<List<AvailableDates>> findByProfessionalId(Integer professionalId);

    @Query("SELECT e FROM AvailableDates e WHERE e.dateTime BETWEEN :fechaInicio AND :fechaFin AND e.professional.id = :professionalId")
    Optional<List<AvailableDates>> findEventosWithin30Minutes(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin,
            @Param("professionalId") Integer professionalId);

    Optional<List<AvailableDates>> findByTypeAppointmentAndAvailableTrue(TypeAppointment typeAppointment);
    Optional<List<AvailableDates>> findByTypeAppointmentAndAvailableTrueAndProfessional_Id(TypeAppointment typeAppointment, Integer profesionalId);

    @Modifying
    @Transactional
    @Query("DELETE FROM AvailableDates ad WHERE FUNCTION('DATE', ad.dateTime) = :specificDate")
    void deleteAllBySpecificDate(@Param("specificDate")  LocalDate specificDate);
}
