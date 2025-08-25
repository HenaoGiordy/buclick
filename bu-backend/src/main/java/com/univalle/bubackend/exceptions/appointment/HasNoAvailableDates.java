package com.univalle.bubackend.exceptions.appointment;

public class HasNoAvailableDates extends RuntimeException {
    public HasNoAvailableDates(String s) {
        super(s);
    }
}
