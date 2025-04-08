package com.prepaidrecharge.repository;

import com.prepaidrecharge.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Integer> {
    // Fetch plans by category ID
    List<Plan> findByCategory_CategoryId(Integer categoryId);
}