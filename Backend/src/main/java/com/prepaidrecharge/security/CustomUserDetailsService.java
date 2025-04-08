package com.prepaidrecharge.security;

import com.prepaidrecharge.model.User;
import com.prepaidrecharge.model.Role; // Ensure this import is present
import com.prepaidrecharge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // No role check here; allow loading any user
        return user;
    }

    public UserDetails loadUserByMobileNo(String mobileNo) throws UsernameNotFoundException {
        User user = userRepository.findByMobileNo(mobileNo)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with mobile number: " + mobileNo));

        // No role check here; allow loading any user
        return user;
    }
}