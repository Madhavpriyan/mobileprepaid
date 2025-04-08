package com.prepaidrecharge.service;

import com.prepaidrecharge.model.User;
import com.prepaidrecharge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TwilioService twilioService;

    // Generate a 6-digit OTP
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }




    public void saveOTP(String mobileNo, String otp) {
    	 validateMobileNumber(mobileNo); 
        // Strip +91 prefix and trim spaces
        String strippedMobileNo = stripCountryCode(mobileNo).trim();
        System.out.println("Searching for user with mobile number: " + strippedMobileNo);

        // Find user by mobile number
        Optional<User> userOptional = userRepository.findByMobileNo(strippedMobileNo);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user.getMobileNo()); // Log the fetched mobile number
            user.setOtp(otp);
            user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5)); // OTP expires in 5 minutes
            userRepository.save(user);
            
            // Format the number for Twilio
            String formattedMobileNo = formatMobileNumberForTwilio(mobileNo);
            // Send OTP via Twilio
            twilioService.sendSMS(formattedMobileNo, "Your OTP is: " + otp);
        } else {
            System.out.println("User not found for mobile number: " + strippedMobileNo);
            throw new RuntimeException("User with mobile number " + strippedMobileNo + " not found!");
        }
    }

    // Strip +91 prefix
    private String stripCountryCode(String mobileNo) {
        if (mobileNo.startsWith("+91")) {
            return mobileNo.substring(3); // Remove +91
        }
        return mobileNo;
    }

 // Format the mobile number for Twilio
    private String formatMobileNumberForTwilio(String mobileNo) {
        return "+91" + mobileNo; // Add +91 prefix
    }

    // Verify OTP
    public boolean verifyOTP(String mobileNo, String otp) {
        // Strip +91 prefix if present
        String strippedMobileNo = stripCountryCode(mobileNo);
        // Find user by mobile number (10-digit format)
        Optional<User> userOptional = userRepository.findByMobileNo(strippedMobileNo);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getOtp() != null && user.getOtp().equals(otp)) {
                if (LocalDateTime.now().isBefore(user.getOtpExpiryTime())) {
                    clearOTP(user); // Clear OTP after successful verification
                    return true;
                } else {
                    System.out.println("OTP expired!");
                }
            } else {
                System.out.println("OTP mismatch!");
            }
        } else {
            System.out.println("User not found for mobile number: " + strippedMobileNo);
        }
        return false;
    }
    // Clear OTP after successful verification
    private void clearOTP(User user) {
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
    }

   
    // Validate the mobile number
    private void validateMobileNumber(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10 || !mobileNo.matches("\\d{10}")) {
            throw new IllegalArgumentException("Mobile number must be a 10-digit number!");
        }
    }

  
}