package com.univalle.bubackend.repository;

import com.univalle.bubackend.DTOs.odontology.VisitResponse;
import com.univalle.bubackend.models.VisitOdontologyLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface OdontologyVisitRepository extends JpaRepository<VisitOdontologyLog, Integer> {
    Page<VisitOdontologyLog> findAllByUserUsername(String username, Pageable pageable);

    VisitOdontologyLog findById(Long id);

    Page<VisitOdontologyLog> findAllByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<VisitOdontologyLog> findAllByUserUsernameAndDateBetween(String username, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT v FROM VisitOdontologyLog v WHERE v.date BETWEEN :startDate AND :endDate")
    List<VisitOdontologyLog> findAllWithinLastYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
