package com.univalle.bubackend.DTOs.menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateMenuRequest(Integer id,
                                @NotBlank String mainDish,
                                @NotBlank String drink,
                                String dessert,
                                @NotNull Integer price,
                                String note,
                                String link) {
}
