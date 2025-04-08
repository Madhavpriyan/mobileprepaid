package com.prepaidrecharge.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data
@Entity
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(name = "mobile_no", unique = true, nullable = false, length = 10) // Explicitly specify column name
    private String mobileNo; // Field name in the entity

    @Column(name = "quick_number", length = 10)
    private String quickNumber;
    private String username;
    private String email;
    private String location;
    private String alternateMobileNo;
    private String password;
    private String status; // ACTIVE or DEACTIVE

    @ManyToOne
    @JoinColumn(name = "roleId", nullable = false)
    private Role role; // Replace the role field with a Role entity

    private String otp;
    private LocalDateTime otpExpiryTime;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert the role to a GrantedAuthority object
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVE".equals(status);
    }
}