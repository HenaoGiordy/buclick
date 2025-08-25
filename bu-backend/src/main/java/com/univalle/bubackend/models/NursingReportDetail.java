package com.univalle.bubackend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NursingReportDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private Diagnostic diagnostic;

    private Integer count;

    @ManyToOne
    @JoinColumn(name = "nursing_report_id")
    private NursingReport nursingReport;

}
