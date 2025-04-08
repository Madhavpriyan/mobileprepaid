package com.prepaidrecharge.service;

import com.prepaidrecharge.model.Category;
import com.prepaidrecharge.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Add a new category
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Delete a category by ID
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get a category by ID
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category with ID " + id + " not found!"));
    }

    // Add this method to fetch category by name
    public Category getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category with name " + categoryName + " not found!"));
    }
}