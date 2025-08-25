package com.univalle.bubackend.exceptions.appointment;

public class NotProfessional extends RuntimeException {
    public NotProfessional(String message) {
        super(message);
    }
}
