package com.prepaidrecharge.service;

import com.prepaidrecharge.model.Transaction;
import com.prepaidrecharge.model.User;
import com.prepaidrecharge.model.Plan;
import com.prepaidrecharge.repository.TransactionRepository;
import com.prepaidrecharge.repository.UserRepository;
import com.prepaidrecharge.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    // Add a new transaction
    public Transaction addTransaction(Transaction transaction) {
        // Ensure planExpiryDate is set
        if (transaction.getPlanExpiryDate() == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.DAY_OF_MONTH, 30); // Default to 30 days from today
            transaction.setPlanExpiryDate(calendar.getTime());
        }

        // Save the transaction
        return transactionRepository.save(transaction);
    }

    // Fetch transactions for a user
    public List<Transaction> getUserTransactions(Integer userId) {
        return transactionRepository.findByUser_UserIdOrderByTransactionDateDesc(userId);
    }

    // Fetch all recent transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc();
    }

 // Fetch transactions expiring soon (within the next 3 days)
    public List<Transaction> getTransactionsExpiringSoon() {
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);
        calendar.add(Calendar.DAY_OF_MONTH, 3); // 3 days from today
        Date expiryDate = calendar.getTime();

        return transactionRepository.findTransactionsExpiringSoon(today, expiryDate);
    }

    // Fetch Quick Recharge transactions
    public List<Transaction> getQuickRechargeTransactions() {
        return transactionRepository.findByIsQuickRechargeTrueOrderByTransactionDateDesc();
    }
 // Perform Quick Recharge for other users (guest or logged-in)
    public void quickRechargeForOtherUser(Integer loggedInUserId, String mobileNo, Integer planId) {
        try {
            System.out.println("Starting Quick Recharge for mobile number: " + mobileNo);

            // Fetch the user by mobile number
            User user = userRepository.findByMobileNo(mobileNo)
                    .orElseThrow(() -> {
                        System.out.println("User with mobile number " + mobileNo + " not found!");
                        return new RuntimeException("User with mobile number " + mobileNo + " not found!");
                    });

            System.out.println("User found: " + user.getMobileNo());

            // Fetch the plan by planId
            Plan plan = planRepository.findById(planId)
                    .orElseThrow(() -> {
                        System.out.println("Plan with ID " + planId + " not found!");
                        return new RuntimeException("Plan with ID " + planId + " not found!");
                    });

            System.out.println("Plan found: " + plan.getPlanName());

            // Create a transaction for the user
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setPlan(plan);
            transaction.setTransactionDate(new Date());
            transaction.setPlanExpiryDate(calculatePlanExpiryDate());
            transaction.setQuickRecharge(true); // Mark as Quick Recharge

            // Save the transaction
            transactionRepository.save(transaction);
            System.out.println("Transaction saved for user: " + user.getMobileNo());

            // If loggedInUserId is provided, create a transaction for the logged-in user
            if (loggedInUserId != null) {
                User loggedInUser = userRepository.findById(loggedInUserId)
                        .orElseThrow(() -> {
                            System.out.println("Logged-in user not found!");
                            return new RuntimeException("Logged-in user not found!");
                        });

                Transaction loggedInUserTransaction = new Transaction();
                loggedInUserTransaction.setUser(loggedInUser);
                loggedInUserTransaction.setPlan(plan);
                loggedInUserTransaction.setTransactionDate(new Date());
                loggedInUserTransaction.setPlanExpiryDate(calculatePlanExpiryDate());
                loggedInUserTransaction.setQuickRecharge(true); // Mark as Quick Recharge

                // Save the transaction
                transactionRepository.save(loggedInUserTransaction);
                System.out.println("Transaction saved for logged-in user: " + loggedInUser.getMobileNo());
            }
        } catch (Exception e) {
            System.out.println("Error during Quick Recharge: " + e.getMessage());
            throw new RuntimeException("Failed to perform Quick Recharge: " + e.getMessage());
        }
    }

 // Helper method to calculate plan expiry date
    private Date calculatePlanExpiryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DAY_OF_MONTH, 30); // 30 days from today
        return calendar.getTime();
    }
    // Fetch the current active plan for a user
    public Transaction getCurrentPlan(Integer userId) {
        List<Transaction> transactions = transactionRepository.findByUser_UserIdOrderByTransactionDateDesc(userId);
        Date today = new Date();

        for (Transaction transaction : transactions) {
            if (transaction.getPlanExpiryDate() != null && transaction.getPlanExpiryDate().after(today)) {
                return transaction; // Return the first active plan
            }
        }

        return null; // No active plan found
    }

    // Fetch transaction history for a user by mobile number
    public List<Transaction> getUserTransactionHistory(String mobileNo) {
        return transactionRepository.findByUser_MobileNoOrderByTransactionDateDesc(mobileNo);
    }
}