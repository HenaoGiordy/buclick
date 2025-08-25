package com.univalle.bubackend.security.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.repository.UserEntityRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${secret.jwt.key}")
    private String privateKey;

    @Value("${issuer.jwt}")
    private String issuer;

    private final UserEntityRepository userRepository;

    public JwtUtils(UserEntityRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String createToken(Authentication auth){

        try {
            Algorithm algorithm = Algorithm.HMAC256(privateKey);
            String username = auth.getName();
            String authorities = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));

            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.HOUR, 8);
            Date expirationDate = calendar.getTime();

            Optional<UserEntity> user = userRepository.findByUsername(username);
            UserEntity userEntity = user.orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            return JWT.create()
                    .withClaim("id", userEntity.getId())
                    .withIssuer(issuer)
                    .withExpiresAt(expirationDate)
                    .withSubject(username)
                    .withClaim("fullName",userEntity.getName() + " " + userEntity.getLastName())
                    .withClaim("authorities", authorities)
                    .sign(algorithm);

        } catch (JWTCreationException exception){
            throw new JWTCreationException("Error Creating the token", exception);
        }

    }

    public DecodedJWT validateToken(String token){

        try {
            Algorithm algorithm = Algorithm.HMAC256(privateKey);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build();

            return verifier.verify(token);
        } catch (JWTVerificationException exception){
            throw new JWTVerificationException("Invalid JWT, not authorized");
        }
    }

}
