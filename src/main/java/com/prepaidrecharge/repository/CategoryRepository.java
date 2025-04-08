package com.prepaidrecharge.repository;

import com.prepaidrecharge.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // No additional methods needed for basic CRUD operations
	
	Optional<Category> findByCategoryName(String categoryName);
}