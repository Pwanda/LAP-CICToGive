package com.lap.repository;

import com.lap.entity.Comment;
import com.lap.entity.Item;
import com.lap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByItem(Item item);

    List<Comment> findByUser(User user);

    List<Comment> findByItemOrderByCreatedAtDesc(Item item);

    List<Comment> findByItemOrderByCreatedAtAsc(Item item);
}
