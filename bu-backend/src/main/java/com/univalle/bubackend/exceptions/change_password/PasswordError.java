package com.univalle.bubackend.exceptions.change_password;

public class PasswordError extends IllegalArgumentException {
    public PasswordError(String message) {
        super(message);
    }
}
