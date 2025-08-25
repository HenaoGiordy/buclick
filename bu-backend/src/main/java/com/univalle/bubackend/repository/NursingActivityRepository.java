package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.NursingActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NursingActivityRepository extends JpaRepository<NursingActivityLog, Integer> {
    List<NursingActivityLog> findAllByUserUsernameOrderByIdDesc(String username);
    Optional<NursingActivityLog> findById(Integer id);
    List<NursingActivityLog> findAllByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<NursingActivityLog> findAllByDateBetweenOrderByIdDesc(LocalDateTime startDate, LocalDateTime endDate);
    List<NursingActivityLog> findAllByUserUsernameAndDateBetweenOrderByIdDesc(String username, LocalDateTime startDate, LocalDateTime endDate);

}
