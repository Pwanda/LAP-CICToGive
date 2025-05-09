package com.example.backend.repository;

import com.example.backend.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    // Find items by category
    Page<Item> findByCategory(String category, Pageable pageable);
    
    // Find items by name containing the search term (case insensitive)
    Page<Item> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Find items by category and name containing the search term
    Page<Item> findByCategoryAndNameContainingIgnoreCase(String category, String name, Pageable pageable);
    
    // Find items by user ID
    List<Item> findByUserId(Long userId);
}
