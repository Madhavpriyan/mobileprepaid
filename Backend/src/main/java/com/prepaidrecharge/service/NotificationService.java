package com.prepaidrecharge.service;

import com.prepaidrecharge.model.Transaction;
import com.prepaidrecharge.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
@Service
public class NotificationService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TwilioService twilioService;

    // Automatically send notifications 3 days before plan expiry
    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    public void sendAutomaticNotifications() {
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);
        calendar.add(Calendar.DAY_OF_MONTH, 3); // 3 days from today
        Date expiryDate = calendar.getTime();

        List<Transaction> expiringTransactions = transactionRepository.findTransactionsExpiringSoon(today, expiryDate);
        for (Transaction transaction : expiringTransactions) {
            String mobileNo = transaction.getUser().getMobileNo(); // Fetch mobileNo from User entity
            String message = "Your plan is expiring in 3 days! Please renew to avoid service interruption.";
            sendNotification(mobileNo, message);
        }
    }

    // Manually send notifications
    public void sendManualNotification(String mobileNo, String message) {
        sendNotification(mobileNo, message);
    }

    // Simulate sending a notification (e.g., SMS or email)
    private void sendNotification(String mobileNo, String message) {
        System.out.println("Notification sent to " + mobileNo + ": " + message);
        // Uncomment the following line to send SMS via Twilio
        // twilioService.sendSMS(mobileNo, message);
    }
}