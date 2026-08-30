package com.wfc.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private List<String> sizes;

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color")
    private List<String> colors;

    private Integer stock = 0;
    private String badge;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status { ACTIVE, INACTIVE }

    public Product() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }
    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<String> getImages() { return images; }
public void setImages(List<String> images) { this.images = images; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Product p = new Product();
        public Builder name(String v) { p.name = v; return this; }
        public Builder description(String v) { p.description = v; return this; }
        public Builder price(BigDecimal v) { p.price = v; return this; }
        public Builder originalPrice(BigDecimal v) { p.originalPrice = v; return this; }
        public Builder category(String v) { p.category = v; return this; }
        public Builder imageUrl(String v) { p.imageUrl = v; return this; }
        public Builder sizes(List<String> v) { p.sizes = v; return this; }
        public Builder colors(List<String> v) { p.colors = v; return this; }
        public Builder stock(Integer v) { p.stock = v; return this; }
        public Builder badge(String v) { p.badge = v; return this; }
        public Builder status(Status v) { p.status = v; return this; }
        public Product build() { return p; }
        public Builder images(List<String> v) { p.images = v; return this; }
    }
}
