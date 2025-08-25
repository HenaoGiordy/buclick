package com.univalle.bubackend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NursingReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate date;

    private int trimester;

    @Positive
    private int year;

    private int totalActivities;

    @OneToMany(mappedBy = "nursingReport", cascade = CascadeType.ALL)
    private List<NursingReportDetail> diagnosticCount = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "nursing_report_id")
    private List<NursingActivityLog> activities = new ArrayList<>();


}
