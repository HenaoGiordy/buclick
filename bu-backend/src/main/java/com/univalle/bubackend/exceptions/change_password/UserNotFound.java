package com.univalle.bubackend.exceptions.change_password;

public class UserNotFound extends RuntimeException {
    public UserNotFound(String message) {
        super(message);
    }
}
