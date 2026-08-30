package com.wfc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDto {

    public static class Request {
        @NotBlank private String name;
        private String description;
        @NotNull @Positive private BigDecimal price;
        private BigDecimal originalPrice;
        @NotBlank private String category;
        private String imageUrl;
        private List<String> sizes;
        private List<String> colors;
        private Integer stock;
        private String badge;
        private String status;
        private List<String> images;

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
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public List<String> getImages() { return images; }
        public void setImages(List<String> images) { this.images = images; }
    }

    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private String category;
        private String imageUrl;
        private List<String> sizes;
        private List<String> colors;
        private Integer stock;
        private String badge;
        private String status;
        private LocalDateTime createdAt;
        private List<String> images;

        public Response() {}

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getDescription() { return description; }
        public BigDecimal getPrice() { return price; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public String getCategory() { return category; }
        public String getImageUrl() { return imageUrl; }
        public List<String> getSizes() { return sizes; }
        public List<String> getColors() { return colors; }
        public Integer getStock() { return stock; }
        public String getBadge() { return badge; }
        public String getStatus() { return status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public List<String> getImages() { return images; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final Response r = new Response();
            public Builder id(Long v) { r.id = v; return this; }
            public Builder name(String v) { r.name = v; return this; }
            public Builder description(String v) { r.description = v; return this; }
            public Builder price(BigDecimal v) { r.price = v; return this; }
            public Builder originalPrice(BigDecimal v) { r.originalPrice = v; return this; }
            public Builder category(String v) { r.category = v; return this; }
            public Builder imageUrl(String v) { r.imageUrl = v; return this; }
            public Builder sizes(List<String> v) { r.sizes = v; return this; }
            public Builder colors(List<String> v) { r.colors = v; return this; }
            public Builder stock(Integer v) { r.stock = v; return this; }
            public Builder badge(String v) { r.badge = v; return this; }
            public Builder status(String v) { r.status = v; return this; }
            public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
            public Builder images(List<String> v) { r.images = v; return this; }
            public Response build() { return r; }
        }
    }
}