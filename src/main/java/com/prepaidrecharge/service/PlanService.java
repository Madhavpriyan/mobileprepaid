package com.prepaidrecharge.service;

import com.prepaidrecharge.exception.ResourceNotFoundException;
import com.prepaidrecharge.model.Category;
import com.prepaidrecharge.model.Plan;
import com.prepaidrecharge.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {
    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private CategoryService categoryService; // Inject CategoryService

    // Add a new plan with categoryName
    public Plan addPlan(Plan plan, String categoryName) {
        Category category = categoryService.getCategoryByName(categoryName); // Fetch category by name
        plan.setCategory(category); // Set the category on the plan
        return planRepository.save(plan);
    }

    // Update an existing plan
    public Plan updatePlan(Plan plan) {
        return planRepository.save(plan);
    }

    // Delete a plan
    public void deletePlan(Integer id) {
        planRepository.deleteById(id);
    }

    // Get all plans
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    // Get a plan by ID
    public Plan getPlanById(Integer planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + planId));
    }

    // Get plans by category ID
    public List<Plan> getPlansByCategory(Integer categoryId) {
        return planRepository.findByCategory_CategoryId(categoryId);
    }

    // Fetch the total number of plans
    public long getTotalPlans() {
        return planRepository.count();
    }
}