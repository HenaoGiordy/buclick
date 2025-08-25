package com.univalle.bubackend.exceptions.reservation;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
