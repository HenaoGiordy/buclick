package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.NursingReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportNursingRepository extends JpaRepository<NursingReport, Integer> {
    Optional<NursingReport> findById(Integer id);
    List<NursingReport> findByYearAndTrimester(Integer year, Integer trimester);
    List<NursingReport> findByYear(Integer year);
    Optional<NursingReport> findNursingReportByYearAndTrimester(int year, int trimester);
}
