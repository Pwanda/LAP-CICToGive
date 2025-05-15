package com.example.backend.controller;

import com.example.backend.model.Item;
import com.example.backend.model.User;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Autowired
    public ItemController(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // Get all items with pagination and filtering
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<Item> pageItems;
            
            // Apply filters if provided
            if (category != null && !category.isEmpty() && search != null && !search.isEmpty()) {
                pageItems = itemRepository.findByCategoryAndNameContainingIgnoreCase(category, search, pageable);
            } else if (category != null && !category.isEmpty()) {
                pageItems = itemRepository.findByCategory(category, pageable);
            } else if (search != null && !search.isEmpty()) {
                pageItems = itemRepository.findByNameContainingIgnoreCase(search, pageable);
            } else {
                pageItems = itemRepository.findAll(pageable);
            }
            
            List<Item> items = pageItems.getContent();
            
            Map<String, Object> response = new HashMap<>();
            response.put("items", items);
            response.put("currentPage", pageItems.getNumber());
            response.put("totalItems", pageItems.getTotalElements());
            response.put("totalPages", pageItems.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get a single item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemRepository.findById(id);
        return item.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new item
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createItem(@RequestBody ItemRequest itemRequest) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            
            // Create new item
            Item item = new Item();
            item.setName(itemRequest.getName());
            item.setDescription(itemRequest.getDescription());
            item.setCategory(itemRequest.getCategory());
            item.setLocation(itemRequest.getLocation());
            item.setUser(user);
            item.setCreatedAt(LocalDateTime.now());
            item.setUpdatedAt(LocalDateTime.now());
            
            // Add image URLs if provided
            if (itemRequest.getImageUrls() != null && !itemRequest.getImageUrls().isEmpty()) {
                item.setImageUrls(itemRequest.getImageUrls());
            }
            
            Item savedItem = itemRepository.save(item);
            
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create item: " + e.getMessage());
        }
    }

    // Update an existing item
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody ItemRequest itemRequest) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return itemRepository.findById(id)
                .map(existingItem -> {
                    // Check if the item belongs to the current user
                    if (existingItem.getUser() != null && 
                        !existingItem.getUser().getId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body("You don't have permission to update this item");
                    }
                    
                    // Update item details
                    existingItem.setName(itemRequest.getName());
                    existingItem.setDescription(itemRequest.getDescription());
                    existingItem.setCategory(itemRequest.getCategory());
                    existingItem.setLocation(itemRequest.getLocation());
                    existingItem.setUpdatedAt(LocalDateTime.now());
                    
                    // Update image URLs if provided
                    if (itemRequest.getImageUrls() != null && !itemRequest.getImageUrls().isEmpty()) {
                        existingItem.setImageUrls(itemRequest.getImageUrls());
                    }
                    
                    Item updatedItem = itemRepository.save(existingItem);
                    return ResponseEntity.ok(updatedItem);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete an item
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return itemRepository.findById(id)
                .map(item -> {
                    // Check if the item belongs to the current user
                    if (item.getUser() != null && 
                        !item.getUser().getId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body("You don't have permission to delete this item");
                    }
                    
                    itemRepository.delete(item);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Get items by current user
    @GetMapping("/my-items")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Item>> getMyItems() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        List<Item> userItems = itemRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(userItems);
    }
    
    // Request class for item creation/update
    public static class ItemRequest {
        private String name;
        private String description;
        // Price field removed as all items are now free
        private String category;
        private String location;
        private List<String> imageUrls;
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        // Price getters and setters removed
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public String getLocation() {
            return location;
        }
        
        public void setLocation(String location) {
            this.location = location;
        }
        
        public List<String> getImageUrls() {
            return imageUrls;
        }
        
        public void setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }
    }
}
