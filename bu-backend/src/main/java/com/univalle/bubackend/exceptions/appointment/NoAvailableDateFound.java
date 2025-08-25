package com.univalle.bubackend.exceptions.appointment;

public class NoAvailableDateFound extends RuntimeException {
    public NoAvailableDateFound(String s) {
        super(s);
    }
}
