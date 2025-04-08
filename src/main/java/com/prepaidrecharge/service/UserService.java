package com.prepaidrecharge.service;

import com.prepaidrecharge.model.User;
import com.prepaidrecharge.exception.ResourceNotFoundException;
import com.prepaidrecharge.model.Role; // Ensure this import is present
import com.prepaidrecharge.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPService otpService;

    @Autowired
    private TwilioService twilioService;
    

    // Check if a user exists by mobile number
    public boolean existsByMobileNo(String mobileNo) {
        return userRepository.existsByMobileNo(mobileNo);
    }

 // Register a new user
    public String registerUser(User user) {
        // Validate the mobile number
        validateMobileNumber(user.getMobileNo());

        // Check if the mobile number is already registered
        if (userRepository.findByMobileNo(user.getMobileNo()).isPresent()) {
            return "Mobile number already registered!";
        }

        // Set default status to ACTIVE
        user.setStatus("ACTIVE");

        // Save the user
        userRepository.save(user);
        return "User registered successfully!";
    }

   
    // Validate the mobile number
    private void validateMobileNumber(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10 || !mobileNo.matches("\\d{10}")) {
            throw new IllegalArgumentException("Mobile number must be a 10-digit number!");
        }
    }
    // Generate and send OTP
    public String generateAndSendOTP(String mobileNo) {
        // Validate mobile number
        if (mobileNo == null || mobileNo.isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required!");
        }

      

        // Find user by mobile number
        Optional<User> userOptional = userRepository.findByMobileNo(mobileNo);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found!");
        }

        // Generate OTP
        String otp = otpService.generateOTP();

        // Save OTP and send it via Twilio
        otpService.saveOTP(mobileNo, otp);

        return "OTP sent successfully!";
    }

    // Verify OTP and log in the user
    public boolean verifyOTPAndLogin(String mobileNo, String otp) {
        // Ensure mobile number is in the correct format
        if (!mobileNo.startsWith("+")) {
            mobileNo = "+91" + mobileNo.trim(); // Adjust country code as needed
        }

        // Verify OTP
        return otpService.verifyOTP(mobileNo, otp);
    }

    // Fetch user by mobile number
    public User findByMobileNo(String mobileNo) {
        return userRepository.findByMobileNo(mobileNo)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with mobile number: " + mobileNo));
    }

    

 // Fetch all users excluding ADMINs
    public User findByUsername(String username) {
        return userRepository.findByUsernameWithRole(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    // Update user status (active/deactive)
    public User updateUserStatus(Integer userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found!"));
        user.setStatus(status);
        return userRepository.save(user);
    }
    
    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

   

    // Admin login with username and password
    public User adminLogin(String username, String password) {
        return userRepository.findByUsernameAndPasswordAndRole_RoleName(username, password, Role.RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin login failed."));
    }

    // Fetch the count of users by status
    public Map<String, Long> getUsersCountByStatus() {
        List<Object[]> result = userRepository.countUsersByStatus();
        Map<String, Long> userStatusCount = new HashMap<>();

        for (Object[] row : result) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            userStatusCount.put(status, count);
        }

        return userStatusCount;
    }
    public long getCountOfActiveUsers() {
        return userRepository.countByStatusAndRole_RoleName("ACTIVE", Role.RoleName.USER);
    }
    
    public List<User> getAllUsersExcludingAdmins() {
        return userRepository.findAllUsersExcludingAdmins();
    }
    
    // Method to update the quickNumber field
    public void updateQuickNumber(String username, String quickNumber) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        user.setQuickNumber(quickNumber);
        userRepository.save(user);
    }


    // Method to check if a number exists in the database
    public boolean isNumberRegistered(String mobileNo) {
        return userRepository.findByMobileNo(mobileNo).isPresent();
    }
}