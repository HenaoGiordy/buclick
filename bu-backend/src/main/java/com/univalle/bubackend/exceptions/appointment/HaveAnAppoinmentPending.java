package com.univalle.bubackend.exceptions.appointment;

public class HaveAnAppoinmentPending extends RuntimeException {
    public HaveAnAppoinmentPending(String s) {
        super(s);
    }
}
