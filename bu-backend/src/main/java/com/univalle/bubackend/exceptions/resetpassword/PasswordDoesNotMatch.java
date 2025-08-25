package com.univalle.bubackend.exceptions.resetpassword;

public class PasswordDoesNotMatch extends RuntimeException {
    public PasswordDoesNotMatch(String message) {
        super(message);
    }
}
