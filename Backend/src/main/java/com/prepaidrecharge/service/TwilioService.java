package com.prepaidrecharge.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class TwilioService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    public void sendSMS(String to, String message) {
        // Initialize Twilio
        Twilio.init(accountSid, authToken);

        // Send SMS
        Message.creator(
            new PhoneNumber(to), // To phone number (formatted as +91<10-digit number>)
            new PhoneNumber(twilioPhoneNumber), // From Twilio phone number
            message // SMS body
        ).create();
    }
}