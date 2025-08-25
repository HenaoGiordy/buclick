package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.Reservation;
import com.univalle.bubackend.models.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.lunch = true AND DATE(r.data) = :date")
    int countLunchReservationsForDay(LocalDate date);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.snack = true AND DATE(r.data) = :date")
    int countSnackReservationsForDay(LocalDate date);

    @Query("SELECT r FROM Reservation r Where r.userEntity.username = :username AND r.lunch = true AND DATE(r.data) = :date")
    List<Reservation> findLunchReservationByUser(String username, LocalDate date);

    @Query("SELECT r FROM Reservation r Where r.userEntity.username = :username AND r.snack = true AND DATE(r.data) = :date")
    List<Reservation> findSnackReservationByUser(String username, LocalDate date);

    @Query("SELECT r FROM Reservation r Where r.id = :id AND r.lunch = true AND DATE(r.data) = :date AND r.paid = false")
    Optional<Reservation> findLunchReservationById(Integer id, LocalDate date);

    @Query("SELECT r FROM Reservation r Where r.id = :id AND r.snack = true AND DATE(r.data) = :date AND r.paid = false")
    Optional<Reservation> findSnackReservationById(Integer id, LocalDate date);

    @Query("SELECT r FROM Reservation r WHERE r.userEntity = :userEntity AND r.paid = false AND r.lunch = true AND DATE(r.data) = :date")
    List<Reservation> findByUserEntityLunchPaidFalse(UserEntity userEntity, LocalDate date);

    @Query("SELECT r FROM Reservation r WHERE r.userEntity = :userEntity AND r.paid = false AND r.snack = true AND DATE(r.data) = :date")
    List<Reservation> findByUserEntitySnackPaidFalse(UserEntity userEntity, LocalDate date);

    @Query("SELECT r FROM Reservation r Where r.userEntity = :userEntity AND DATE(r.data) = :date AND r.snack = true")
    Optional<Reservation> findSnackReservationPerDay(UserEntity userEntity, LocalDate date);

    @Query("SELECT r FROM Reservation r Where r.userEntity = :userEntity AND DATE(r.data) = :date AND r.lunch = true")
    Optional<Reservation> findLunchReservationPerDay(UserEntity userEntity, LocalDate date);

    @Query("SELECT r FROM Reservation r WHERE r.paid = false AND DATE(r.data) = :date AND r.lunch = true")
    Page<Reservation> findAllLunchByPaidFalse(Pageable pageable, LocalDate date);

    @Query("SELECT r FROM Reservation r WHERE r.paid = false AND DATE(r.data) = :date AND r.snack = true")
    Page<Reservation> findAllSnackByPaidFalse(Pageable pageable, LocalDate date);
}
