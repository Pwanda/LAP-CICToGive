package com.example.backend.controller;

import com.example.backend.model.Comment;
import com.example.backend.model.Item;
import com.example.backend.model.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.UserDetailsImpl;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items/{itemId}/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentController(
        CommentRepository commentRepository,
        ItemRepository itemRepository,
        UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // Get all comments for an item
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(
        @PathVariable Long itemId
    ) {
        List<Comment> comments =
            commentRepository.findByItemIdOrderByCreatedAtDesc(itemId);
        return ResponseEntity.ok(comments);
    }

    // Add a new comment to an item
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addComment(
        @PathVariable Long itemId,
        @RequestBody CommentRequest commentRequest
    ) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        UserDetailsImpl userDetails =
            (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> userOptional = userRepository.findById(
            userDetails.getId()
        );
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Optional<Item> itemOptional = itemRepository.findById(itemId);
        if (!itemOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Item not found");
        }

        User user = userOptional.get();
        Item item = itemOptional.get();

        Comment comment = new Comment();
        comment.setText(commentRequest.getText());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUser(user);
        comment.setItem(item);

        Comment savedComment = commentRepository.save(comment);

        return ResponseEntity.ok(savedComment);
    }

    // DTO for comment creation
    public static class CommentRequest {

        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
