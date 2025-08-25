package com.univalle.bubackend.exceptions.appointment;

public class CantReserveMoreAppointments extends RuntimeException {
    public CantReserveMoreAppointments(String s) {
        super(s);
    }
}
