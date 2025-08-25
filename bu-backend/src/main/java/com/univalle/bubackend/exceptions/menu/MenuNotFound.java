package com.univalle.bubackend.exceptions.menu;

public class MenuNotFound extends RuntimeException {
    public MenuNotFound(String message) {
        super(message);
    }
}
