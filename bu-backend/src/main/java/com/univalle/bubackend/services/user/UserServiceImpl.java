package com.univalle.bubackend.services.user;

import com.univalle.bubackend.DTOs.user.*;

import com.univalle.bubackend.exceptions.report.CSVFieldException;


import com.univalle.bubackend.exceptions.users.EmailAlreadyExist;
import com.univalle.bubackend.exceptions.users.InvalidFilter;
import com.univalle.bubackend.exceptions.ResourceNotFoundException;
import com.univalle.bubackend.exceptions.change_password.PasswordError;
import com.univalle.bubackend.exceptions.users.RoleNotFound;
import com.univalle.bubackend.exceptions.change_password.UserNotFound;
import com.univalle.bubackend.exceptions.resetpassword.PasswordDoesNotMatch;
import com.univalle.bubackend.exceptions.users.UserNameAlreadyExist;
import com.univalle.bubackend.models.Role;
import com.univalle.bubackend.models.RoleName;
import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.repository.RoleRepository;
import com.univalle.bubackend.repository.UserEntityRepository;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;


import java.util.*;

import java.util.stream.Collectors;

@Service
public class UserServiceImpl {

    private final UserEntityRepository userEntityRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserEntityRepository userEntityRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userEntityRepository = userEntityRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    public UserResponse createUser(UserRequest userRequest) {
        Optional<UserEntity> existingUserOpt = userEntityRepository.findByUsername(userRequest.username());

        // Si el usuario ya existe
        if (existingUserOpt.isPresent()) {
            throw new UserNameAlreadyExist("El usuario ya está registrado.");
        }

        //Verifica si el correo ya está registrado
        if (!userEntityRepository.findUsersByEmail(userRequest.email()).isEmpty() && userRequest.email() != null) {
            throw new EmailAlreadyExist("Ya hay un usuario registrado con este correo.");
        }

        // Validación de roles para usuario nuevo
        Set<Role> roles = getRolesFromRequest(userRequest.roles());
        if (roles.isEmpty()) {
            throw new RoleNotFound("Debe proporcionar al menos un rol para el usuario.");
        }

        // Generación de contraseña
        String generatedPassword = generatePassword(userRequest.name(), userRequest.username(), userRequest.lastName());

        // Creación de nuevo usuario
        UserEntity newUser = UserEntity.builder()
                .name(userRequest.name())
                .lastName(userRequest.lastName())
                .email(userRequest.email())
                .username(userRequest.username())
                .password(passwordEncoder.encode(generatedPassword))
                .plan(userRequest.plan())
                .roles(roles)
                .build();

        setBeneficiaryStatus(newUser, userRequest.beca());
        userEntityRepository.save(newUser);

        return new UserResponse(newUser);
    }

    private Set<Role> getRolesFromRequest(Set<String> roleRequests) {
        return roleRequests.stream()
                .map(roleName -> roleRepository.findByName(RoleName.valueOf(roleName))
                        .orElseThrow(() -> new RoleNotFound("No se ha creado el rol " + roleName)))
                .collect(Collectors.toSet());
    }

    private void setBeneficiaryStatus(UserEntity user, String beca) {
        user.setLunchBeneficiary("Beneficiario almuerzo".equalsIgnoreCase(beca));
        user.setSnackBeneficiary("Beneficiario refrigerio".equalsIgnoreCase(beca));
    }


    public UserResponse findStudentsByUsername(String username) {
        Optional<UserEntity> optionalUser = userEntityRepository.findByUsername(username);

        UserEntity user = optionalUser.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return new UserResponse(user);
    }

    public UserResponse findUsersByUsername(String username, String filter) {

        UserEntity user;
        Optional<UserEntity> optionalUser;

        switch (filter.toLowerCase()) {
            case "beneficiarios", "estudiantes":
                if(userEntityRepository.findByUsername(username).isEmpty()){
                    throw new ResourceNotFoundException("Usuario no encontrado");
                }
                optionalUser = userEntityRepository.findByUsernameWithRole(username, RoleName.ESTUDIANTE);
                user = optionalUser.orElseThrow(() -> new ResourceNotFoundException("No se permite la búsqueda de usuarios que no sean estudiantes"));
                break;
            case "funcionarios":
                optionalUser = userEntityRepository.findByUsername(username);
                user = optionalUser.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                break;
            default:
                throw new InvalidFilter("Filtro no válido");
        }


        return new UserResponse(user);
    }

    public EditUserResponse editUser(EditUserRequest editUserRequest) {
        Optional<UserEntity> optionalUser = userEntityRepository.findById(editUserRequest.id());
        UserEntity user = optionalUser.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Optional<UserEntity> existinUserByEmailOpt = userEntityRepository.findByEmail(editUserRequest.email());

        if (editUserRequest.email().contains("@")) {
            if (existinUserByEmailOpt.isPresent() && !Objects.equals(user.getId(), existinUserByEmailOpt.get().getId())) {
                throw new UserNameAlreadyExist("El correo ya está registrado");
            }
        }

        Set<Role> roles = editUserRequest.roles().stream()
                .map(roleRequest -> roleRepository.findByName(RoleName.valueOf(roleRequest.name()))
                        .orElseThrow(() -> new RoleNotFound("No se ha creado el role " + roleRequest)))
                .collect(Collectors.toSet());

        if (!editUserRequest.username().equalsIgnoreCase(user.getUsername()) || !editUserRequest.name().equalsIgnoreCase(user.getName())
                || !editUserRequest.lastName().equalsIgnoreCase(user.getLastName())) {
            String updatePassword = generatePassword(editUserRequest.name(), editUserRequest.username(), editUserRequest.lastName());
            user.setPassword(passwordEncoder.encode(updatePassword));
        }
        user.setUsername(editUserRequest.username());
        user.setName(editUserRequest.name());
        user.setLastName(editUserRequest.lastName());
        user.setEmail(editUserRequest.email());
        user.setPlan(editUserRequest.plan());
        user.setEps(editUserRequest.eps());
        user.setSemester(editUserRequest.semester());
        user.setPhone(editUserRequest.phone());
        user.setRoles(roles);
        user.setIsActive(editUserRequest.isActive());
        user.setLunchBeneficiary(editUserRequest.lunchBeneficiary());
        user.setSnackBeneficiary(editUserRequest.snackBeneficiary());

        userEntityRepository.save(user);

        return new EditUserResponse("Usuario editado satisfactoriamente", new UserResponse(user));
    }


    public List<UserResponse> importUsers(MultipartFile file, RoleName roleName) {
        List<UserResponse> users = new ArrayList<>();
        try {
            String firstLine = new BufferedReader(new InputStreamReader(file.getInputStream())).readLine();
            char delimiter = detectDelimiter(firstLine);

            Reader reader = new InputStreamReader(file.getInputStream());
            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withDelimiter(delimiter).withHeader());

            for (CSVRecord record : csvParser) {

                String username = null;
                if (record.isMapped("codigo/cedula")) {
                    username = record.get("codigo/cedula");
                } else if (record.isMapped("codigo")) {
                    username = record.get("codigo");
                } else if (record.isMapped("cedula")) {
                    username = record.get("cedula");
                }
                String name = record.get("nombre");
                String lastName = record.get("apellido");
                String email = record.get("correo");

                String plan = null;
                if (record.isMapped("plan/area")) {
                    plan = record.get("plan/area");
                } else if (record.isMapped("plan")) {
                    plan = record.get("plan");
                } else if (record.isMapped("area")) {
                    plan = record.get("area");
                }

                String nota;
                if (record.isMapped("Las opciones de beneficio son: almuerzo/refrigerio")) {
                    nota = record.get("Las opciones de beneficio son: almuerzo/refrigerio").trim();
                    if (nota.isEmpty()) {
                        nota = null;
                    }
                }

                String beca = record.isMapped("beneficio") ? record.get("beneficio") : null;

                if (username == null || username.trim().isEmpty()) {
                    throw new CSVFieldException("El campo 'codigo/cedula' está vacío en el archivo CSV.");
                }
                if (name == null || name.trim().isEmpty()) {
                    throw new CSVFieldException("El campo 'nombre' está vacío en el archivo CSV.");
                }
                if (lastName == null || lastName.trim().isEmpty()) {
                    throw new CSVFieldException("El campo 'apellido' está vacío en el archivo CSV.");
                }
                if (email == null || email.trim().isEmpty()) {
                    throw new CSVFieldException("El campo 'correo' está vacío en el archivo CSV.");
                }
                if (plan == null || plan.trim().isEmpty()) {
                    throw new CSVFieldException("El campo 'plan/area' está vacío en el archivo CSV.");
                }

                UserRequest userRequest = new UserRequest(
                        username.trim(),
                        name.trim(),
                        lastName.trim(),
                        email.trim(),
                        null,
                        plan.trim(),
                        Set.of(roleName.name()),
                        beca
                );

                UserResponse userResponse = importUser(userRequest);

                users.add(userResponse);
            }

            csvParser.close();

        } catch (Exception e) {
            throw new CSVFieldException("Error en el archivo CSV: " + e.getMessage());
        }

        return users;
    }

    private char detectDelimiter(String firstLine) {
        String[] delimiters = {",", ";", "\t", "|"};

        for (String delimiter : delimiters) {
            if (firstLine.split(delimiter).length > 1) {
                return delimiter.charAt(0);
            }
        }

        throw new IllegalArgumentException("No se pudo detectar un delimitador válido en el archivo CSV.");
    }

    public UserResponse importUser(UserRequest userRequest) {
        Optional<UserEntity> userOpt = userEntityRepository.findByUsername(userRequest.username());
        UserEntity newUser;

        Optional<UserEntity> existinUserByEmailOpt = userEntityRepository.findByEmail(userRequest.email());

        if (userOpt.isPresent()) {
            newUser = userOpt.get();

            if(existinUserByEmailOpt.isPresent() && !Objects.equals(newUser.getId(), existinUserByEmailOpt.get().getId())) {
                throw new UserNameAlreadyExist("El usuario con codigo " + newUser.getUsername() + " tiene un correo el cual ya está registrado");
            }

            if (!userRequest.name().equalsIgnoreCase(newUser.getName()) || !userRequest.lastName().equalsIgnoreCase(newUser.getLastName())) {
                String updatePassword = generatePassword(userRequest.name(), userRequest.username(), userRequest.lastName());
                newUser.setPassword(passwordEncoder.encode(updatePassword));
            }

            newUser.setName(userRequest.name());
            newUser.setLastName(userRequest.lastName());
            newUser.setEmail(userRequest.email());
            newUser.setPlan(userRequest.plan());

            String beca = userRequest.beca();
            if ("almuerzo".equalsIgnoreCase(beca)) {
                newUser.setLunchBeneficiary(true);
                newUser.setSnackBeneficiary(false);
            } else if ("refrigerio".equalsIgnoreCase(beca)) {
                newUser.setLunchBeneficiary(false);
                newUser.setSnackBeneficiary(true);
            } else {
                newUser.setLunchBeneficiary(false);
                newUser.setSnackBeneficiary(false);
            }

          //  newUser.setRoles(userRequest.roles());

            newUser.setIsActive(true);

        } else {
            String generatedPassword = generatePassword(userRequest.name(), userRequest.username(), userRequest.lastName());
            Set<Role> roles = userRequest.roles().stream().map(role -> roleRepository.findByName(RoleName.valueOf(role.toUpperCase()))
                    .orElseThrow(() -> new RoleNotFound("No se encontro el rol"))).collect(Collectors.toSet());


            newUser = UserEntity.builder()
                    .username(userRequest.username())
                    .name(userRequest.name())
                    .lastName(userRequest.lastName())
                    .plan(userRequest.plan())
                    .password(passwordEncoder.encode(generatedPassword))
                    .email(userRequest.email())
                    .roles(roles)
                    .isActive(true)
                    .lunchBeneficiary("almuerzo".equalsIgnoreCase(userRequest.beca()))
                    .snackBeneficiary("refrigerio".equalsIgnoreCase(userRequest.beca()))
                    .build();

            if(existinUserByEmailOpt.isPresent() && !Objects.equals(newUser.getId(), existinUserByEmailOpt.get().getId())) {
                throw new UserNameAlreadyExist("El usuario con codigo " + newUser.getUsername() + " tiene un correo el cual ya está registrado");
            }

        }

        userEntityRepository.save(newUser);

        return new UserResponse(newUser);
    }

    private String generatePassword(String name, String username,
                                    String lastName) {
        String initialName = name.substring(0, 1).toUpperCase();
        String initialLastName = lastName.substring(0, 1).toUpperCase();

        return initialName + username + initialLastName;
    }

    public PasswordResponse changePassword(PasswordRequest passwordRequest) {

        Optional<UserEntity> userOpt = userEntityRepository.findByUsername(passwordRequest.username());
        UserEntity user = userOpt.orElseThrow(() -> new UserNotFound("No se encontró el usuario"));

        if (passwordRequest.newPassword().length() < 8){
            throw new PasswordError("La contraseña debe tener minimo 8 caracteres");
        }

        if (!passwordEncoder.matches(passwordRequest.password(), user.getPassword())) {
            throw new PasswordError("La contraseña actual es incorrecta");
        }

        if (passwordEncoder.matches(passwordRequest.newPassword(), user.getPassword())) {
            throw new PasswordError("La nueva contraseña no puede ser igual a la contraseña actual");
        }

        if (!passwordRequest.newPassword().equals(passwordRequest.confirmPassword())) {
            throw new PasswordDoesNotMatch("Las contraseñas no coinciden");
        }

        user.setPassword(passwordEncoder.encode(passwordRequest.newPassword()));
        userEntityRepository.save(user);

        return new PasswordResponse("Contraseña cambiada con exito");

    }

    public Page<ListUser> listUsers(String filter, Pageable pageable){
        Page<UserEntity> users;

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id"));

        switch (filter.toLowerCase()) {
            case "beneficiarios":
                users = userEntityRepository.findBeneficiaries(sortedPageable);
                break;
            case "funcionarios":
                users = userEntityRepository.findAllNonStudents(sortedPageable);
                break;
            case "estudiantes":
                users = userEntityRepository.findAllStudents(sortedPageable);
                break;
            default:
                throw new InvalidFilter("Filtro no válido");
        }

        return users.map(user -> ListUser.builder()
                .id(user.getId())
                .snackBeneficiary(user.getSnackBeneficiary())
                .lunchBeneficiary(user.getLunchBeneficiary())
                .roles(user.getRoles())
                .plan(user.getPlan())
                .email(user.getEmail())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .isActive(user.getIsActive())
                .name(user.getName())
                .build()
        );
    }

    public void deleteBeneficiaries() {
        List<UserEntity> beneficiaries = userEntityRepository.findByLunchBeneficiaryTrueOrSnackBeneficiaryTrue();

        beneficiaries.forEach(user -> {
            user.setLunchBeneficiary(false);
            user.setSnackBeneficiary(false);
        });

        userEntityRepository.saveAll(beneficiaries);

    }

    public void deleteBeneficiary(String username){
        UserEntity user = userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("No se encontro el usuario"));

        user.setLunchBeneficiary(false);
        user.setSnackBeneficiary(false);

        userEntityRepository.save(user);
    }

}
