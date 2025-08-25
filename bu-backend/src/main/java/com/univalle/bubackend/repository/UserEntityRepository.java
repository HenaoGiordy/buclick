package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.models.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    @Query("SELECT u FROM UserEntity u WHERE u.email = :email")
    List<UserEntity> findUsersByEmail(String email);

    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE u.username = :username AND r.name = :role")
    Optional<UserEntity> findByUsernameWithRole(@Param("username") String username, @Param("role") RoleName role);

    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE u.username = :username AND r.name <> :student AND r.name <> :monitor")
    Optional<UserEntity> findByUsernameNoStudent(@Param("username") String username, @Param("student") RoleName student, @Param("monitor") RoleName monitor);

    @Query("SELECT u FROM UserEntity u JOIN u.reservations r WHERE r.lunch = true AND r.paid = true AND r.data BETWEEN :startOfDay AND :endOfDay")
    List<UserEntity> findUserLunchPaid(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT u FROM UserEntity u JOIN u.reservations r WHERE r.snack = true AND r.paid = true AND r.data BETWEEN :startOfDay AND :endOfDay")
    List<UserEntity> findUserSnackPaid(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    List<UserEntity> findByLunchBeneficiaryTrueOrSnackBeneficiaryTrue();

    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE r.name = 'ESTUDIANTE'")
    Page<UserEntity> findAllStudents(Pageable pageable);

    @Query("SELECT u FROM UserEntity u WHERE u.lunchBeneficiary = true OR u.snackBeneficiary = true")
    Page<UserEntity> findBeneficiaries(Pageable pageable);

    @Query("SELECT u FROM UserEntity u JOIN u.roles r where r.name <> 'ESTUDIANTE'")
    Page<UserEntity> findAllNonStudents(Pageable pageable);

    @Query("SELECT DISTINCT u FROM UserEntity u JOIN u.reservations r WHERE r.data BETWEEN :startDate AND :endDate")
    List<UserEntity> findAllByReservationDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


}
