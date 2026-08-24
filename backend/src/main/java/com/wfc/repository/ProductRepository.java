package com.wfc.repository;

import com.wfc.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatusOrderByCreatedAtDesc(Product.Status status);
    List<Product> findByCategoryAndStatusOrderByCreatedAtDesc(String category, Product.Status status);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.category) LIKE LOWER(CONCAT('%',:q,'%')))")
    List<Product> search(@Param("q") String query);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.status = 'ACTIVE'")
    List<String> findDistinctCategories();
}
