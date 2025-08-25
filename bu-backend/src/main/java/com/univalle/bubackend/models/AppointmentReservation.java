package com.univalle.bubackend.models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.scheduling.TaskScheduler;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availabledates_id")
    private AvailableDates availableDates;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id")
    private UserEntity estudiante;

    @Builder.Default
    private Boolean assistant = null;

    @Builder.Default
    private Boolean pendingAppointment = true;
}
