package com.univalle.bubackend.exceptions.appointment;

public class HasDatesPending extends RuntimeException {
    public HasDatesPending(String s) {
        super(s);
    }
}
