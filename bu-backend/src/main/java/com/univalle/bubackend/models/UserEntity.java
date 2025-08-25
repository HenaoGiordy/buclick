package com.univalle.bubackend.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String lastName;

    private String email;

    @NotBlank
    private String plan;

    @Builder.Default
    private Boolean isActive = Boolean.TRUE;

    @Builder.Default
    private Boolean lunchBeneficiary = false;

    @Builder.Default
    private Boolean snackBeneficiary = false;

    @Builder.Default
    private String eps = null;

    @Builder.Default
    private String semester = null;

    @Positive
    private Long phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Gender gender = null;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Reservation> reservations;

    @ManyToMany(mappedBy = "userEntities")
    @JsonBackReference
    private Set<Report> reports = new HashSet<>();

}
