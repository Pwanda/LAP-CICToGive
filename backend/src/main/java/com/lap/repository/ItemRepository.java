package com.lap.repository;

import com.lap.entity.Item;
import com.lap.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCategory(String category);

    List<Item> findByUser(User user);

    List<Item> findByIsReserved(Boolean isReserved);

    @Query(
        "SELECT i FROM Item i WHERE i.title LIKE %:keyword% OR i.description LIKE %:keyword%"
    )
    List<Item> findByKeyword(@Param("keyword") String keyword);

    @Query(
        "SELECT i FROM Item i WHERE i.category = :category AND (i.title LIKE %:keyword% OR i.description LIKE %:keyword%)"
    )
    List<Item> findByCategoryAndKeyword(
        @Param("category") String category,
        @Param("keyword") String keyword
    );

    List<Item> findAllByOrderByCreatedAtDesc();

    List<Item> findByUserUsernameOrderByCreatedAtDesc(String username);
}
