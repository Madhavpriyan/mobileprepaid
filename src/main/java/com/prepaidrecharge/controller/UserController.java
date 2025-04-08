package com.prepaidrecharge.controller;

import com.prepaidrecharge.exception.ResourceNotFoundException;
import com.prepaidrecharge.model.Category;
import com.prepaidrecharge.model.Plan;
import com.prepaidrecharge.model.Role;
import com.prepaidrecharge.model.Transaction;
import com.prepaidrecharge.model.User;
import com.prepaidrecharge.repository.UserRepository;
import com.prepaidrecharge.security.CustomUserDetailsService;
import com.prepaidrecharge.security.JwtResponse;
import com.prepaidrecharge.security.JwtUtil;
import com.prepaidrecharge.model.SupportQuery;
import com.prepaidrecharge.service.CategoryService;
import com.prepaidrecharge.service.PlanService;
import com.prepaidrecharge.service.TransactionService;
import com.prepaidrecharge.service.UserService;
import com.prepaidrecharge.service.SupportQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PlanService planService;
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private SupportQueryService supportQueryService;

    // Register a new user (default role: USER)
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // If no role is provided, default to USER (roleId = 1)
        if (user.getRole() == null || user.getRole().getRoleId() == null) {
            Role userRole = new Role();
            userRole.setRoleId(1); // Default to USER
            user.setRole(userRole);
        }

        String response = userService.registerUser(user);
        return ResponseEntity.ok(response);
    }

    // Generate and send OTP (only for USER role)
    @PostMapping("/generate-otp")
    public ResponseEntity<?> generateOTP(@RequestParam String mobileNo) {
        try {
            // Fetch the user by mobile number
            User user = userService.findByMobileNo(mobileNo);

            // Check if the user exists and has the USER role
            if (user == null || !user.getRole().getRoleName().equals(Role.RoleName.USER)) {
                return ResponseEntity.badRequest().body("OTP generation failed: Invalid mobile number.");
            }

            // Generate and send OTP
            userService.generateAndSendOTP(mobileNo);
            return ResponseEntity.ok("OTP sent successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestParam String mobileNo, @RequestParam String otp) {
        try {
            boolean isVerified = userService.verifyOTPAndLogin(mobileNo, otp);
            if (isVerified) {
                // Load user details
                UserDetails userDetails = userDetailsService.loadUserByMobileNo(mobileNo);

                // Generate JWT token
                String token = jwtUtil.generateToken(userDetails);

                // Return the token
                return ResponseEntity.ok(new JwtResponse(token));
            } else {
                return ResponseEntity.badRequest().body("Invalid OTP!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
 
    
    @GetMapping("/plans/{planId}")
    public ResponseEntity<?> getPlanById(@PathVariable Integer planId) {
      try {
        Plan plan = planService.getPlanById(planId);
        return ResponseEntity.ok(plan);
      } catch (ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch plan: " + e.getMessage());
      }
    }

    // Fetch plans by category
    @GetMapping("/plans/category/{categoryId}")
    public ResponseEntity<?> getPlansByCategory(@PathVariable Integer categoryId) {
        try {
            List<Plan> plans = planService.getPlansByCategory(categoryId);
            if (plans.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No plans available for this category.");
            }
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch plans: " + e.getMessage());
        }
    }
 // Fetch transaction history for the logged-in user
    @GetMapping("/transaction-history")
    public ResponseEntity<?> getTransactionHistory(@RequestParam String mobileNo) {
        try {
            User loggedInUser = userService.findByMobileNo(mobileNo);
            List<Transaction> transactions = transactionService.getUserTransactionHistory(mobileNo);
            return ResponseEntity.ok(transactions);
        } catch (ResourceNotFoundException ex) {
            throw ex; // This will be caught by the GlobalExceptionHandler
        }
    }
    @GetMapping("/current-plan")
    public ResponseEntity<?> getCurrentPlan(@RequestParam Integer userId) {
        try {
            // Fetch the logged-in user's ID (from session or token)
            User loggedInUser = userService.getUserById(userId);
            if (loggedInUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in or invalid user ID.");
            }

            // Fetch the current active plan
            Transaction currentPlan = transactionService.getCurrentPlan(userId);
            if (currentPlan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active plan found for user ID " + userId);
            }
            return ResponseEntity.ok(currentPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch current plan: " + e.getMessage());
        }
    }
 // Submit a support query
    @PostMapping("/contact-us")
    public ResponseEntity<String> submitQuery(@RequestBody SupportQuery supportQuery, @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from the JWT token
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(jwtToken); // Extract username from token
            User loggedInUser = userService.findByUsername(username); // Fetch user by username

            if (loggedInUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in or invalid token.");
            }

            // Set the user ID in the support query
            supportQuery.setUserId(loggedInUser.getUserId());

            // Save the support query
            supportQueryService.saveQuery(supportQuery);
            return ResponseEntity.ok("Query submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit query: " + e.getMessage());
        }
    }
    
    @PostMapping("/update-mobile")
    public ResponseEntity<?> updateQuickNumber(
        @RequestHeader("Authorization") String token,
        @RequestParam String quickNumber
    ) {
        try {
            // Extract username from the JWT token
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));

            // Check if the quick recharge number exists in the database
            if (!userService.isNumberRegistered(quickNumber)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The number is not registered. Please enter a valid number.");
            }

            // Update the logged-in user's quickNumber field
            userService.updateQuickNumber(username, quickNumber);

            return ResponseEntity.ok("Quick recharge number updated successfully!");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update quick recharge number: " + e.getMessage());
        }
    }
    
    // Endpoint to fetch user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            // Debug: Print the token
            System.out.println("Token: " + token);

            // Extract username from the JWT token
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            System.out.println("Username: " + username);

            // Fetch user details from the database
            User user = userService.findByUsername(username);
            System.out.println("User: " + user);

            // Return user details
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            // Debug: Print the exception
            System.out.println("Error in /user/profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch user profile: " + e.getMessage());
        }
    
    }
    // Fetch all categories
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            if (categories.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No categories available.");
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch categories: " + e.getMessage());
        }
    }
    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        try {
            List<Plan> plans = planService.getAllPlans();
            if (plans.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No plans available.");
            }
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch plans: " + e.getMessage());
        }
    }
    
    @GetMapping("/is-number-registered")
    public ResponseEntity<Boolean> checkNumberExists(
        @RequestParam String mobileNo,
        @RequestHeader(value = "Authorization", required = false) String token) {
        
        // Allow both authenticated and unauthenticated access
        boolean exists = userService.isNumberRegistered(mobileNo);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/validate-mobile")
    public ResponseEntity<?> validateMobileNumber(
        @RequestParam String mobileNo,
        @RequestHeader(value = "Authorization", required = false) String token) {
        
        // Basic validation
        if (!mobileNo.matches("^[6-9]\\d{9}$")) {
            return ResponseEntity.badRequest().body("Invalid mobile number format");
        }

        boolean exists = userService.isNumberRegistered(mobileNo);
        if (!exists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body("Mobile number not registered");
        }
        
        return ResponseEntity.ok().build();
    }
}