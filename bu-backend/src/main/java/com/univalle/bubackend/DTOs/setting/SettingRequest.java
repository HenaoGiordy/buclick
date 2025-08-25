package com.univalle.bubackend.DTOs.setting;

import java.time.LocalDate;
import java.time.LocalTime;

public record SettingRequest(Integer id,
                             LocalDate startSemester,
                             LocalDate endSemester,
                             Integer numLunch,
                             Integer numSnack,
                             LocalTime starBeneficiaryLunch,
                             LocalTime endBeneficiaryLunch,
                             LocalTime starLunch,
                             LocalTime endLunch,
                             LocalTime starBeneficiarySnack,
                             LocalTime endBeneficiarySnack,
                             LocalTime starSnack,
                             LocalTime endSnack) {
}
