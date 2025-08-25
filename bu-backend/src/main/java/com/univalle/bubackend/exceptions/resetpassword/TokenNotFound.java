package com.univalle.bubackend.exceptions.resetpassword;

public class TokenNotFound extends RuntimeException {
    public TokenNotFound(String tokenNoEncontrado) {
        super(tokenNoEncontrado);
    }
}
