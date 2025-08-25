package com.univalle.bubackend.exceptions.reservation;

public class NoSlotsAvailableException extends RuntimeException {
    public NoSlotsAvailableException(String message) {
        super(message);
    }
}
