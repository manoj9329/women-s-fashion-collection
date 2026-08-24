package com.wfc.service;

import com.wfc.dto.ProductDto;
import com.wfc.entity.Product;
import com.wfc.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDto.Response> getAllActive() {
        return productRepository.findByStatusOrderByCreatedAtDesc(Product.Status.ACTIVE)
                .stream().map(this::toResponse).toList();
    }

    public List<ProductDto.Response> getAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<ProductDto.Response> getByCategory(String category) {
        return productRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, Product.Status.ACTIVE)
                .stream().map(this::toResponse).toList();
    }

    public List<ProductDto.Response> search(String query) {
        return productRepository.search(query).stream().map(this::toResponse).toList();
    }

    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    public ProductDto.Response getById(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found")));
    }

    public ProductDto.Response create(ProductDto.Request req) {
        Product p = Product.builder()
                .name(req.getName()).description(req.getDescription())
                .price(req.getPrice()).originalPrice(req.getOriginalPrice())
                .category(req.getCategory()).imageUrl(req.getImageUrl())
                .sizes(req.getSizes()).colors(req.getColors())
                .stock(req.getStock() != null ? req.getStock() : 0)
                .badge(req.getBadge())
                .status("INACTIVE".equals(req.getStatus()) ? Product.Status.INACTIVE : Product.Status.ACTIVE)
                .build();
        return toResponse(productRepository.save(p));
    }

    public ProductDto.Response update(Long id, ProductDto.Request req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setOriginalPrice(req.getOriginalPrice());
        p.setCategory(req.getCategory());
        p.setImageUrl(req.getImageUrl());
        p.setSizes(req.getSizes());
        p.setColors(req.getColors());
        p.setStock(req.getStock() != null ? req.getStock() : p.getStock());
        p.setBadge(req.getBadge());
        if (req.getStatus() != null) p.setStatus(Product.Status.valueOf(req.getStatus()));
        return toResponse(productRepository.save(p));
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private ProductDto.Response toResponse(Product p) {
        return ProductDto.Response.builder()
                .id(p.getId()).name(p.getName()).description(p.getDescription())
                .price(p.getPrice()).originalPrice(p.getOriginalPrice())
                .category(p.getCategory()).imageUrl(p.getImageUrl())
                .sizes(p.getSizes()).colors(p.getColors())
                .stock(p.getStock()).badge(p.getBadge())
                .status(p.getStatus().name()).createdAt(p.getCreatedAt())
                .build();
    }
}
