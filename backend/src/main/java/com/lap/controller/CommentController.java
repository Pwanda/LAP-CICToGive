package com.lap.controller;

import com.lap.entity.Comment;
import com.lap.entity.Item;
import com.lap.entity.User;
import com.lap.repository.CommentRepository;
import com.lap.repository.ItemRepository;
import com.lap.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createComment(
        @RequestParam("text") String text,
        @RequestParam("itemId") Long itemId,
        Authentication authentication
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get current user
            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("error", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Get item
            Optional<Item> itemOpt = itemRepository.findById(itemId);
            if (!itemOpt.isPresent()) {
                response.put("success", false);
                response.put("error", "Item not found");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            Item item = itemOpt.get();

            // Create comment
            Comment comment = new Comment(text, item, user);
            Comment savedComment = commentRepository.save(comment);

            response.put("success", true);
            response.put("message", "Comment created successfully");
            response.put("data", createCommentResponse(savedComment));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put(
                "error",
                "Failed to create comment: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<Map<String, Object>> getCommentsForItem(
        @PathVariable Long itemId
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Item> itemOpt = itemRepository.findById(itemId);
            if (!itemOpt.isPresent()) {
                response.put("success", false);
                response.put("error", "Item not found");
                return ResponseEntity.badRequest().body(response);
            }

            Item item = itemOpt.get();
            List<Comment> comments =
                commentRepository.findByItemOrderByCreatedAtAsc(item);

            List<Map<String, Object>> commentResponses = comments
                .stream()
                .map(this::createCommentResponse)
                .toList();

            response.put("success", true);
            response.put("data", commentResponses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put(
                "error",
                "Failed to fetch comments: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteComment(
        @PathVariable Long id,
        Authentication authentication
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            String username = authentication.getName();
            Optional<Comment> commentOpt = commentRepository.findById(id);

            if (!commentOpt.isPresent()) {
                response.put("success", false);
                response.put("error", "Comment not found");
                return ResponseEntity.badRequest().body(response);
            }

            Comment comment = commentOpt.get();

            // Check if user owns the comment
            if (!comment.getUser().getUsername().equals(username)) {
                response.put("success", false);
                response.put("error", "You can only delete your own comments");
                return ResponseEntity.badRequest().body(response);
            }

            commentRepository.delete(comment);

            response.put("success", true);
            response.put("message", "Comment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put(
                "error",
                "Failed to delete comment: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    private Map<String, Object> createCommentResponse(Comment comment) {
        Map<String, Object> commentMap = new HashMap<>();
        commentMap.put("id", comment.getId());
        commentMap.put("text", comment.getText());
        commentMap.put("author", comment.getUser().getUsername());
        commentMap.put("date", comment.getCreatedAt().toString());
        return commentMap;
    }
}
