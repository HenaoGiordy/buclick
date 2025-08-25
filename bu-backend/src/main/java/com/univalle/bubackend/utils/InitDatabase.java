package com.univalle.bubackend.utils;

import com.univalle.bubackend.models.Role;
import com.univalle.bubackend.models.RoleName;
import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.repository.RoleRepository;
import com.univalle.bubackend.repository.UserEntityRepository;
import org.apache.catalina.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Configuration
public class InitDatabase {

    @Bean
    CommandLineRunner database(PasswordEncoder passwordEncoder, UserEntityRepository userEntityRepository, RoleRepository roleRepository) {
        return args -> {

            Role estudentRole = null;
            if (roleRepository.count() == 0) {
                Role adminRole = Role.builder().name(RoleName.ADMINISTRADOR).build();
                estudentRole = Role.builder().name(RoleName.ESTUDIANTE).build();
                Role odontologoRole = Role.builder().name(RoleName.ODONTOLOGO).build();
                Role enfermeroRole = Role.builder().name(RoleName.ENFERMERO).build();
                Role externoRole = Role.builder().name(RoleName.EXTERNO).build();
                Role monitoRole = Role.builder().name(RoleName.MONITOR).build();
                Role psicologoRole = Role.builder().name(RoleName.PSICOLOGO).build();
                Role funcionarioRole = Role.builder().name(RoleName.FUNCIONARIO).build();

                // Guardar todos los roles
                roleRepository.saveAll(List.of(adminRole, estudentRole, odontologoRole, enfermeroRole, externoRole, monitoRole, psicologoRole, funcionarioRole));
            }

            // Recuperar los roles persistidos desde la base de datos
            Role adminRole = roleRepository.findByName(RoleName.ADMINISTRADOR).orElseThrow();

            Optional<UserEntity> userEntity = userEntityRepository.findByUsername("admin");
            if (!userEntity.isPresent()) {
                UserEntity adminUser = UserEntity.builder()
                        .name("admin")
                        .lastName("Bienestar")
                        .username("admin")
                        .email("no_tiene")
                        .plan("Bienestar Universitario")
                        .roles(Set.of(adminRole))  // Usar el role recuperado y gestionado
                        .password(passwordEncoder.encode("admin"))
                        .build();

                userEntityRepository.save(adminUser);
            }



        };
    }
}
