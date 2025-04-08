package com.prepaidrecharge.model;

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
