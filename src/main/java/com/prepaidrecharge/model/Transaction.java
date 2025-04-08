package com.prepaidrecharge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "planId", nullable = false)
    private Plan plan;

    private Date transactionDate;
    private Date planExpiryDate;
    private boolean isQuickRecharge;
    private String paymentMethod;
    private String orderId; // New field for Cashfree order tracking
}