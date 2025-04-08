package com.prepaidrecharge.controller;




import com.prepaidrecharge.model.Category;
import com.prepaidrecharge.model.Plan;
import com.prepaidrecharge.model.Role;
import com.prepaidrecharge.model.Transaction;
import com.prepaidrecharge.model.User;
import com.prepaidrecharge.repository.CategoryRepository;
import com.prepaidrecharge.security.CustomUserDetailsService;
import com.prepaidrecharge.security.JwtResponse;
import com.prepaidrecharge.security.JwtUtil;
import com.prepaidrecharge.service.PlanService;
import com.prepaidrecharge.service.TransactionService;
import com.prepaidrecharge.service.CategoryService;
import com.prepaidrecharge.service.NotificationService;
import com.prepaidrecharge.model.SupportQuery;
import com.prepaidrecharge.service.SupportQueryService;
import com.prepaidrecharge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;    

    @Autowired
    private PlanService planService;
 
    @Autowired
    private TransactionService transactionService;
    

    @Autowired
    private SupportQueryService supportQueryService; 
   
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CategoryService categoryService;
    // Admin login with username and password
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestParam String username, @RequestParam String password) {
        try {
            // Fetch the user by username
            User user = userService.findByUsername(username);

            // Check if the user exists and has the ADMIN role
            if (user == null || !user.getRole().getRoleName().equals(Role.RoleName.ADMIN)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin login failed: Invalid credentials.");
            }

            // Authenticate the admin
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails);

            // Return the token
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin login failed: " + e.getMessage());
        }
    }

    

   

    // Add a new category
    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        try {
            // Validate required fields
            if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
                return ResponseEntity.badRequest().body("Category name is required!");
            }

            // Save the category
            Category newCategory = categoryService.addCategory(category);
            return ResponseEntity.ok(newCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add category: " + e.getMessage());
        }
    }
    // Delete a category by ID
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            // Check if the category exists
            Category existingCategory = categoryService.getCategoryById(id);
            if (existingCategory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with ID " + id + " not found!");
            }

            // Delete the category
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category: " + e.getMessage());
        }
    }
 

    // Get all categories
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

    // Get a category by ID
    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        try {
            Category category = categoryService.getCategoryById(id);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with ID " + id + " not found!");
            }
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch category: " + e.getMessage());
        }
    }
  

    // Add a new plan
    @PostMapping("/plans")
    public ResponseEntity<?> addPlan(@RequestBody Map<String, Object> planRequest) {
        try {
            // Extract fields from the request body
            String planName = (String) planRequest.get("planName");
            Double planPrice = Double.valueOf(planRequest.get("planPrice").toString());
            String categoryName = (String) planRequest.get("categoryName"); // Get categoryName
            String data = (String) planRequest.get("data");
            String validity = (String) planRequest.get("validity");
            String benefits = (String) planRequest.get("benefits");
            String planDetailsContent = (String) planRequest.get("planDetailsContent");

            // Validate required fields
            if (planName == null || planPrice == null || categoryName == null) {
                return ResponseEntity.badRequest().body("Plan name, price, and category name are required!");
            }

            // Create a new Plan object
            Plan plan = new Plan();
            plan.setPlanName(planName);
            plan.setPlanPrice(planPrice);
            plan.setData(data);
            plan.setValidity(validity);
            plan.setBenefits(benefits);
            plan.setPlanDetailsContent(planDetailsContent);

            // Save the plan using categoryName
            Plan newPlan = planService.addPlan(plan, categoryName);
            return ResponseEntity.ok(newPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add plan: " + e.getMessage());
        }
    }

    // Update an existing plan
    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Integer id, @RequestBody Plan plan) {
        try {
            // Check if the plan exists
            Plan existingPlan = planService.getPlanById(id);
            if (existingPlan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan with ID " + id + " not found!");
            }

            // Update the plan
            plan.setPlanId(id); // Ensure the correct plan ID is set
            Plan updatedPlan = planService.updatePlan(plan);
            return ResponseEntity.ok(updatedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update plan: " + e.getMessage());
        }
    }

    // Delete a plan
    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Integer id) {
        try {
            // Check if the plan exists
            Plan existingPlan = planService.getPlanById(id);
            if (existingPlan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan with ID " + id + " not found!");
            }

            // Delete the plan
            planService.deletePlan(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete plan: " + e.getMessage());
        }
    }
    // Get all plans
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

    // Get a plan by ID
    @GetMapping("/plans/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable Integer id) {
        try {
            Plan plan = planService.getPlanById(id);
            if (plan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan with ID " + id + " not found!");
            }
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch plan: " + e.getMessage());
        }
    }
 // Change user status (active/deactive)
    @PutMapping("/users/status")
    public ResponseEntity<String> updateUserStatus(
            @RequestParam Integer userId,
            @RequestParam String status) {
        try {
            User user = userService.updateUserStatus(userId, status);
            return ResponseEntity.ok("User status updated to " + status + " for user ID " + userId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    // View all support queries
    @GetMapping("/support-queries")
    public ResponseEntity<List<SupportQuery>> getAllSupportQueries() {
        List<SupportQuery> queries = supportQueryService.getAllQueries();
        return ResponseEntity.ok(queries);
    }

    // View users with plans expiring in the next 3 days
    @GetMapping("/expiring-plans")
    public ResponseEntity<?> getExpiringPlans() {
        try {
            List<Transaction> expiringTransactions = transactionService.getTransactionsExpiringSoon();
            if (expiringTransactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No plans expiring in the next 3 days.");
            }
            return ResponseEntity.ok(expiringTransactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch expiring plans: " + e.getMessage());
        }
    }
    // Send notifications to users with expiring plans
    @PostMapping("/send-expiry-notifications")
    public ResponseEntity<String> sendExpiryNotifications() {
        List<Transaction> expiringTransactions = transactionService.getTransactionsExpiringSoon();
        for (Transaction transaction : expiringTransactions) {
            String mobileNo = transaction.getUser().getMobileNo();
            String message = "Your plan is expiring in 3 days! Please renew to avoid service interruption.";
            notificationService.sendManualNotification(mobileNo, message);
        }
        return ResponseEntity.ok("Notifications sent successfully!");
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Fetch all users excluding admins
        List<User> users = userService.getAllUsersExcludingAdmins();
        return ResponseEntity.ok(users);
    }
    // View Quick Recharge transactions
    @GetMapping("/quick-recharge-transactions")
    public ResponseEntity<?> getQuickRechargeTransactions() {
        try {
            List<Transaction> transactions = transactionService.getQuickRechargeTransactions();
            if (transactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No Quick Recharge transactions found.");
            }
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch Quick Recharge transactions: " + e.getMessage());
        }
    }
    
    // View all recent transactions
    @GetMapping("/recent-transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        System.out.println("Fetching recent transactions");
        try {
            List<Transaction> transactions = transactionService.getAllTransactions();
            System.out.println("Transactions fetched: " + transactions.size());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.out.println("Error fetching transactions: " + e.getMessage());
            throw e;
        }
    }
    

 // Fetch the count of users by status
    @GetMapping("/users/count-by-status")
    public ResponseEntity<Map<String, Long>> getUsersCountByStatus() {
        Map<String, Long> userStatusCount = userService.getUsersCountByStatus();
        return ResponseEntity.ok(userStatusCount);
    }
    
    // Fetch the total number of plans
    @GetMapping("/total-plans")
    public ResponseEntity<?> getTotalPlans() {
        try {
            // Fetch the total number of plans
            long totalPlans = planService.getTotalPlans();

            // Create a response object
            Map<String, Long> response = new HashMap<>();
            response.put("totalPlans", totalPlans);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch total plans: " + e.getMessage());
        }
    }
    @GetMapping("/admin/users/count-active-users")
    public ResponseEntity<Long> getCountOfActiveUsers() {
        long count = userService.getCountOfActiveUsers();
        return ResponseEntity.ok(count);
    }
    
}