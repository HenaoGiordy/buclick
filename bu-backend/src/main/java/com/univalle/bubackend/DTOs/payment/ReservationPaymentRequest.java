package com.univalle.bubackend.DTOs.payment;

public record ReservationPaymentRequest(
        String username,
        boolean paid
) {

}
