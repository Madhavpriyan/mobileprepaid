package com.prepaidrecharge.model;

public class PaymentSummaryResponse {
    private String mobileNo;
    private Plan planDetails;

    // Getters and Setters
    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public Plan getPlanDetails() {
        return planDetails;
    }

    public void setPlanDetails(Plan planDetails) {
        this.planDetails = planDetails;
    }
}