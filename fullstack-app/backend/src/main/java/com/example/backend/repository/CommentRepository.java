package com.example.backend.repository;

import com.example.backend.model.Comment;
import com.example.backend.model.Item;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByItemOrderByCreatedAtDesc(Item item);
    List<Comment> findByItemIdOrderByCreatedAtDesc(Long itemId);
}
