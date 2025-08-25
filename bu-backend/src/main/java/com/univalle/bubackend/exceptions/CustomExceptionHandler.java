package com.univalle.bubackend.exceptions;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.univalle.bubackend.exceptions.appointment.*;
import com.univalle.bubackend.exceptions.change_password.PasswordError;
import com.univalle.bubackend.exceptions.change_password.UserNotFound;
import com.univalle.bubackend.exceptions.nursing.FieldException;
import com.univalle.bubackend.exceptions.report.*;
import com.univalle.bubackend.exceptions.reservation.NoSlotsAvailableException;
import com.univalle.bubackend.exceptions.reservation.UnauthorizedException;
import com.univalle.bubackend.exceptions.resetpassword.AlreadyLinkHasBeenCreated;
import com.univalle.bubackend.exceptions.resetpassword.PasswordDoesNotMatch;
import com.univalle.bubackend.exceptions.resetpassword.TokenExpired;
import com.univalle.bubackend.exceptions.resetpassword.TokenNotFound;
import com.univalle.bubackend.exceptions.setting.InvalidTimeException;
import com.univalle.bubackend.exceptions.setting.SettingNotFound;
import com.univalle.bubackend.exceptions.users.InvalidFilter;
import com.univalle.bubackend.exceptions.users.RoleNotFound;
import com.univalle.bubackend.exceptions.users.UserNameAlreadyExist;
import com.univalle.bubackend.exceptions.users.EmailAlreadyExist;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@ControllerAdvice
public class CustomExceptionHandler {


    @ExceptionHandler(AlreadyLinkHasBeenCreated.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<Map<String, String>> handleAlreadyLinkHasBeenCreated(AlreadyLinkHasBeenCreated ex) {

        Map<String, String> map = new HashMap<>();
        map.put("Error", ex.getMessage());

        return new ResponseEntity<>(map, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(PasswordDoesNotMatch.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handlePasswordDoesNotMatch(PasswordDoesNotMatch ex) {
        Map<String, String> map = new HashMap<>();
        map.put("Error", ex.getMessage());
        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TokenExpired.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<Map<String, String>> handleTokenExpired(TokenExpired ex) {
        Map<String, String> map = new HashMap<>();
        map.put("Error", ex.getMessage());
        return new ResponseEntity<>(map, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TokenNotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Map<String, String>> handleTokenNotFound(TokenNotFound ex) {
        Map<String, String> map = new HashMap<>();
        map.put("Error", ex.getMessage());
        return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        for (ConstraintViolation<?> violation : violations) {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            errors.put(fieldName, errorMessage);
        }
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionDTO> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        String errorMessage = "Error de integridad de datos.";

        // Obtener el mensaje de error
        String message = Objects.requireNonNull(ex.getRootCause()).getMessage();

        //No hayan dos citas en la misma hora
        if (message.contains("available_dates_date_time_professional_id_key")) {
            errorMessage = "El profesional ya tiene una cita asignada en esa fecha y hora.";
        }
        //Para el username del UserEntity
        if (message.contains("user_entity_username_key")) {
            errorMessage = "Ya existe un usuario con ese nombre de usuario.";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(RoleNotFound.class)
    public ResponseEntity<ExceptionDTO> roleNotFoundException(RoleNotFound ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage) );
    }


    @ExceptionHandler(CSVFieldException.class)
    public ResponseEntity<ExceptionDTO> handleCSVFieldException(CSVFieldException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage) );

    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<Map<String, String>> handleJWTVerificationException(JWTVerificationException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("Error", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(PasswordError.class)
    public ResponseEntity<ExceptionDTO> handlePasswordError(PasswordError ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<ExceptionDTO> handleUserNotFound(UserNotFound ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(ReportNotFound.class)
    public ResponseEntity<ExceptionDTO> handleReportNotFound(ReportNotFound ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(BecaInvalid.class)
    public ResponseEntity<ExceptionDTO> handleBecaInvalid(BecaInvalid ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage) );
    }


    @ExceptionHandler(NotProfessional.class)
    public ResponseEntity<ExceptionDTO> handleNotProfessional(NotProfessional ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(UserNameAlreadyExist.class)
    public ResponseEntity<ExceptionDTO> handleUserNameAlreadyExist(UserNameAlreadyExist ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(EmailAlreadyExist.class)
    public ResponseEntity<ExceptionDTO> handleEmailAlreadyExist(EmailAlreadyExist ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(NotValidTypeAppointment.class)
    public ResponseEntity<ExceptionDTO> handleNotValidTypeAppointment(NotValidTypeAppointment ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(HasNoAvailableDates.class)
    public ResponseEntity<ExceptionDTO> handleNotValidTypeAppointment(HasNoAvailableDates ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(SettingNotFound.class)
    public ResponseEntity<ExceptionDTO> handleSettingNotFound(SettingNotFound ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage) );

    }

    @ExceptionHandler(NoAvailableDateFound.class)
    public ResponseEntity<ExceptionDTO> handleNoAvailableDateFound(NoAvailableDateFound ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(IsExterno.class)
    public ResponseEntity<ExceptionDTO> handleIsExterno(IsExterno ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(DateNotAvailable.class)
    public ResponseEntity<ExceptionDTO> handleDateNotAvailable(DateNotAvailable ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(HasDatesPending.class)
    public ResponseEntity<ExceptionDTO> handleHasPending(HasDatesPending ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(InvalidDateFormat.class)
    public ResponseEntity<ExceptionDTO> handleInvalidDateFormat(InvalidDateFormat ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(InvalidTimeException.class)
    public ResponseEntity<ExceptionDTO> handleInvalidTimeException(InvalidTimeException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(InvalidFilter.class)
    public ResponseEntity<ExceptionDTO> handleInvalidFilter(InvalidFilter ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleJsonParseException(HttpMessageNotReadableException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Error de deserialización del JSON: " + Objects.requireNonNull(ex.getRootCause()).getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(NoSlotsAvailableException.class)
    public ResponseEntity<ExceptionDTO> handleNoSlotsAvailable(NoSlotsAvailableException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionDTO> handleResourceNotFound(ResourceNotFoundException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ExceptionDTO> handleUnauthorizedException(UnauthorizedException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(ReservationNotFoud.class)
    public ResponseEntity<ExceptionDTO> handleReservationNotFoud(ReservationNotFoud ex){
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<String> handleMultipartException(MultipartException ex) {
        return new ResponseEntity<>("Error: La solicitud debe ser de tipo multipart/form-data.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<String> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e) {
        return ResponseEntity
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body("Error: Tipo de contenido no soportado. Por favor envíe multipart/form-data.");
    }

    @ExceptionHandler(HaveAnAppoinmentPending.class)
    public ResponseEntity<ExceptionDTO> handleHttpMediaTypeNotAcceptableException(HaveAnAppoinmentPending e) {
        String errorMessage = e.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(CantReserveMoreAppointments.class)
    public ResponseEntity<ExceptionDTO> handleCantReserveMoreAppointments(CantReserveMoreAppointments ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage) );
    }

    @ExceptionHandler(ReportAlreadyExistsException.class)
    public ResponseEntity<ExceptionDTO> handleReportAlreadyExistsException(ReportAlreadyExistsException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(FieldException.class)
    public ResponseEntity<ExceptionDTO> handleFieldException(FieldException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionDTO> handleIllegalArgumentException(IllegalArgumentException ex) {
        String errorMessage = ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionDTO(errorMessage));
    }

}
