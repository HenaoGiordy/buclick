package com.univalle.bubackend.exceptions.resetpassword;

public class TokenExpired extends RuntimeException {
    public TokenExpired(String s) {
        super(s);
    }
}
