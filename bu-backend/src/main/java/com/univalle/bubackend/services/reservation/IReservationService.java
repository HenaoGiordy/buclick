package com.univalle.bubackend.services.reservation;

import com.univalle.bubackend.DTOs.payment.ReservationPaymentRequest;
import com.univalle.bubackend.DTOs.payment.ReservationPaymentResponse;
import com.univalle.bubackend.DTOs.reservation.*;
import com.univalle.bubackend.models.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface IReservationService {

    ReservationUserResponse createReservation(UserEntity user, boolean lunch, boolean snack);

    ReservationResponse createStudentReservation(ReservationStudentRequest reservationRequest);

    ReservationResponse createExternReservation(ReservationExternRequest reservationRequest);

    ExternResponse getExtern(String username);

    AvailabilityResponse getAvailability();

    AvailabilityPerHourResponse getAvailabilityPerHour();

    List<ReservationResponse> getReservationsPerDay(String username);

    ReservationResponse cancelReservation(Integer reservationId);

    ReservationResponse findReservationByUsername(String username);

    ReservationPaymentResponse registerPayment(ReservationPaymentRequest paymentRequest);

    Page<ListReservationResponse> getActiveReservations(Pageable pageable);
}