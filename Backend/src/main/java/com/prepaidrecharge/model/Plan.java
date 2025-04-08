package com.prepaidrecharge.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;



@Data
@Entity
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer planId;

    private String planName;
    private Double planPrice;
    private String data;
    private String validity;
    private String benefits;
    private String planDetailsContent;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    @JsonBackReference // Add this annotation
    private Category category;
}