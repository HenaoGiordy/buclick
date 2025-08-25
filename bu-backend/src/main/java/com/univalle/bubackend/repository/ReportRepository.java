package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    Optional<Report> findById(Integer id);
    List<Report> findBySemester(String semester);
    List<Report> findAllByDate(LocalDate date);

    @Query("SELECT r FROM  Report r WHERE r.semester IS NULL")
    Page<Report> findDailyReports(Pageable pageable);

    @Query("SELECT r FROM Report r WHERE r.semester IS NOT NULL")
    Page<Report> findSemesterReports(Pageable pageable);

    Page<Report> findAll(Pageable pageable);

}
