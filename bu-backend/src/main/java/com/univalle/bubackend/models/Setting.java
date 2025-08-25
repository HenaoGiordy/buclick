package com.univalle.bubackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private LocalDate startSemester;

    @NotNull
    private LocalDate endSemester;

    @PositiveOrZero
    private Integer numLunch;

    @PositiveOrZero
    private Integer numSnack;

    @NotNull
    private LocalTime startBeneficiaryLunch;

    @NotNull
    private LocalTime endBeneficiaryLunch;

    @NotNull
    private LocalTime startLunch;

    @NotNull
    private LocalTime endLunch;

    @NotNull
    private LocalTime startBeneficiarySnack;

    @NotNull
    private LocalTime endBeneficiarySnack;

    @NotNull
    private LocalTime startSnack;

    @NotNull
    private LocalTime endSnack;



}
