package com.prepaidrecharge.controller;

import com.prepaidrecharge.model.Transaction;
import com.prepaidrecharge.model.User;
import com.prepaidrecharge.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepaidrecharge.model.PaymentSummaryResponse;
import com.prepaidrecharge.model.Plan;
import com.prepaidrecharge.service.TransactionService;
import com.prepaidrecharge.service.UserService;
import com.prepaidrecharge.service.PlanService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PlanService planService;
    

    
    @Autowired
    private JwtUtil jwtUtil; 

    @Value("${cashfree.appId}")
    private String cashfreeAppId;

    @Value("${cashfree.secretKey}")
    private String cashfreeSecretKey;

    @Value("${cashfree.apiUrl}")
    private String cashfreeApiUrl;
    // Handle Quick Recharge for guest and logged-in users
    @PostMapping("/quick-recharge")
    public ResponseEntity<String> quickRecharge(
            @RequestParam String mobileNo, // Mobile number to recharge
            @RequestParam Integer planId, // Plan ID
            @RequestHeader(value = "Authorization", required = false) String token // Optional token for logged-in users
    ) {
        try {
            Integer loggedInUserId = null;

            // If the user is logged in, extract the user ID from the token
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.replace("Bearer ", "");
                String username = jwtUtil.extractUsername(jwtToken); // Extract username from token
                User loggedInUser = userService.findByUsername(username); // Fetch user by username
                loggedInUserId = loggedInUser.getUserId(); // Get logged-in user ID
            }

            // Perform the Quick Recharge
            transactionService.quickRechargeForOtherUser(loggedInUserId, mobileNo, planId);
            return ResponseEntity.ok("Quick Recharge successful for " + mobileNo + "!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // Fetch payment summary (mobile number and plan details)
    @GetMapping("/summary")
    public ResponseEntity<?> getPaymentSummary(
            @RequestParam String mobileNo, // Mobile number of the user (logged-in or guest)
            @RequestParam Integer planId  // Plan ID selected by the user
    ) {
        try {
            // Fetch the user by mobile number
            User user = userService.findByMobileNo(mobileNo);
            if (user == null) {
                return ResponseEntity.badRequest().body("User with mobile number " + mobileNo + " not found!");
            }

            // Fetch the plan by planId
            Plan plan = planService.getPlanById(planId);
            if (plan == null) {
                return ResponseEntity.badRequest().body("Plan with ID " + planId + " not found!");
            }

            // Create a payment summary response
            PaymentSummaryResponse paymentSummary = new PaymentSummaryResponse();
            paymentSummary.setMobileNo(mobileNo);
            paymentSummary.setPlanDetails(plan);

            return ResponseEntity.ok(paymentSummary);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/initiate-payment")
    public ResponseEntity<?> initiatePayment(
            @RequestBody PaymentRequest paymentRequest,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String mobileNo = paymentRequest.getMobileNo();
            Integer planId = paymentRequest.getPlanId();
            Double amount = paymentRequest.getAmount();
            boolean isGuest = paymentRequest.isGuest();

            // Fetch user and plan
            Plan plan = planService.getPlanById(planId);
            User user = userService.findByMobileNo(mobileNo);

            // Generate unique order ID
            String orderId = "ORDER_" + System.currentTimeMillis();

            // Prepare Cashfree payment request
            Map<String, String> paymentData = new HashMap<>();
            paymentData.put("appId", cashfreeAppId);
            paymentData.put("secretKey", cashfreeSecretKey);
            paymentData.put("orderId", orderId);
            paymentData.put("orderAmount", String.valueOf(amount));
            paymentData.put("orderCurrency", "INR");
            paymentData.put("orderNote", "Recharge for " + mobileNo);
            paymentData.put("customerPhone", mobileNo);
            paymentData.put("customerEmail", user.getEmail() != null ? user.getEmail() : "guest@example.com");
            paymentData.put("returnUrl", "http://localhost:5501/success.html?orderId=" + orderId);

            // Create Cashfree payment session
            String paymentSessionId = createCashfreePaymentSession(paymentData);

            // Save initial transaction
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setPlan(plan);
            transaction.setTransactionDate(new Date());
            transaction.setPlanExpiryDate(calculatePlanExpiryDate());
            transaction.setQuickRecharge(isGuest);
            transaction.setPaymentMethod("CASHFREE");
            transaction.setOrderId(orderId); // Store Cashfree order ID
            transactionService.addTransaction(transaction);

            // Return payment session details
            Map<String, String> response = new HashMap<>();
            response.put("paymentSessionId", paymentSessionId);
            response.put("orderId", orderId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error initiating payment: " + e.getMessage());
        }
    }

    // New endpoint to verify payment
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            String orderId = request.getOrderId();
            String mobileNo = request.getMobileNo();
            Integer planId = request.getPlanId();

            // Verify payment status with Cashfree
            Map<String, String> verificationData = verifyCashfreePayment(orderId);

            String paymentStatus = verificationData.get("paymentStatus");
            Map<String, String> response = new HashMap<>();

            if ("SUCCESS".equals(paymentStatus)) {
                // Payment successful - no additional transaction update needed as it’s already saved
                response.put("status", "SUCCESS");
                response.put("message", "Payment verified successfully");
            } else {
                response.put("status", "FAILED");
                response.put("message", verificationData.get("message") != null ? verificationData.get("message") : "Transaction failed");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error verifying payment: " + e.getMessage());
        }
    }

    // Helper method to create Cashfree payment session
    private String createCashfreePaymentSession(Map<String, String> paymentData) throws Exception {
        String url = cashfreeApiUrl + "/orders";
        System.out.println("Cashfree API URL: " + url);
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("x-api-version", "2023-08-01");
        conn.setRequestProperty("x-client-id", cashfreeAppId);
        conn.setRequestProperty("x-client-secret", cashfreeSecretKey);
        conn.setDoOutput(true);

        // Construct correct Cashfree payload
        Map<String, Object> cashfreePayload = new HashMap<>();
        cashfreePayload.put("order_id", paymentData.get("orderId"));
        cashfreePayload.put("order_amount", Double.parseDouble(paymentData.get("orderAmount")));
        cashfreePayload.put("order_currency", paymentData.get("orderCurrency"));
        cashfreePayload.put("order_note", paymentData.get("orderNote"));
        Map<String, String> customerDetails = new HashMap<>();
        customerDetails.put("customer_id", "USER_" + paymentData.get("customerPhone")); // Unique ID
        customerDetails.put("customer_phone", paymentData.get("customerPhone"));
        customerDetails.put("customer_email", paymentData.get("customerEmail"));
        cashfreePayload.put("customer_details", customerDetails);
        Map<String, String> orderMeta = new HashMap<>();
        orderMeta.put("return_url", paymentData.get("returnUrl"));
        cashfreePayload.put("order_meta", orderMeta);

        String jsonInputString = new ObjectMapper().writeValueAsString(cashfreePayload);
        System.out.println("Cashfree request payload: " + jsonInputString);
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        System.out.println("Cashfree response code: " + responseCode);
        if (responseCode != 200) {
            String errorMessage = conn.getResponseMessage();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "utf-8"))) {
                StringBuilder errorResponse = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    errorResponse.append(line);
                }
                System.out.println("Cashfree error response: " + errorResponse.toString());
            }
            throw new RuntimeException("Failed to create payment session: " + errorMessage);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            System.out.println("Cashfree response: " + response.toString());
            JsonNode jsonResponse = new ObjectMapper().readTree(response.toString());
            return jsonResponse.get("payment_session_id").asText();
        }
    }

    // Helper method to verify Cashfree payment
    private Map<String, String> verifyCashfreePayment(String orderId) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(cashfreeApiUrl + "/api/v3/order/info?order_id=" + orderId).openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("x-api-version", "2023-08-01");
        conn.setRequestProperty("x-client-id", cashfreeAppId);
        conn.setRequestProperty("x-client-secret", cashfreeSecretKey);

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new RuntimeException("Failed to verify payment: " + conn.getResponseMessage());
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            JsonNode jsonResponse = new ObjectMapper().readTree(response.toString());
            Map<String, String> result = new HashMap<>();
            result.put("paymentStatus", jsonResponse.get("order_status").asText());
            result.put("message", jsonResponse.get("order_note").asText());
            return result;
        }
    }

    // Helper method to calculate plan expiry date
    private Date calculatePlanExpiryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DAY_OF_MONTH, 30); // Default to 30 days
        return calendar.getTime();
    }
}

// DTOs for request bodies
class PaymentRequest {
    private String mobileNo;
    private Integer planId;
    private Double amount;
    private boolean isGuest;

    // Getters and setters
    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }
    public Integer getPlanId() { return planId; }
    public void setPlanId(Integer planId) { this.planId = planId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public boolean isGuest() { return isGuest; }
    public void setGuest(boolean isGuest) { this.isGuest = isGuest; }
}

class PaymentVerificationRequest {
    private String orderId;
    private String mobileNo;
    private Integer planId;

    // Getters and setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }
    public Integer getPlanId() { return planId; }
    public void setPlanId(Integer planId) { this.planId = planId; }
}

