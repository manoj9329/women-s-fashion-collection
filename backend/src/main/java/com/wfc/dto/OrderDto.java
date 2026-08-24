package com.wfc.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    public static class ItemRequest {
        private Long productId;
        private Integer quantity;
        private String size;
        private String color;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class CreateRequest {
        private List<ItemRequest> items;
        private String shippingAddress;

        public List<ItemRequest> getItems() { return items; }
        public void setItems(List<ItemRequest> items) { this.items = items; }
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    }

    public static class Response {
        private Long id;
        private List<ItemResponse> items;
        private BigDecimal totalAmount;
        private String status;
        private String razorpayOrderId;
        private String shippingAddress;
        private LocalDateTime createdAt;

        public Response() {}
        public Long getId() { return id; }
        public List<ItemResponse> getItems() { return items; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public String getStatus() { return status; }
        public String getRazorpayOrderId() { return razorpayOrderId; }
        public String getShippingAddress() { return shippingAddress; }
        public LocalDateTime getCreatedAt() { return createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final Response r = new Response();
            public Builder id(Long v) { r.id = v; return this; }
            public Builder items(List<ItemResponse> v) { r.items = v; return this; }
            public Builder totalAmount(BigDecimal v) { r.totalAmount = v; return this; }
            public Builder status(String v) { r.status = v; return this; }
            public Builder razorpayOrderId(String v) { r.razorpayOrderId = v; return this; }
            public Builder shippingAddress(String v) { r.shippingAddress = v; return this; }
            public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
            public Response build() { return r; }
        }
    }

    public static class ItemResponse {
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private String size;
        private String color;
        private BigDecimal unitPrice;

        public ItemResponse() {}
        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public String getImageUrl() { return imageUrl; }
        public Integer getQuantity() { return quantity; }
        public String getSize() { return size; }
        public String getColor() { return color; }
        public BigDecimal getUnitPrice() { return unitPrice; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final ItemResponse r = new ItemResponse();
            public Builder productId(Long v) { r.productId = v; return this; }
            public Builder productName(String v) { r.productName = v; return this; }
            public Builder imageUrl(String v) { r.imageUrl = v; return this; }
            public Builder quantity(Integer v) { r.quantity = v; return this; }
            public Builder size(String v) { r.size = v; return this; }
            public Builder color(String v) { r.color = v; return this; }
            public Builder unitPrice(BigDecimal v) { r.unitPrice = v; return this; }
            public ItemResponse build() { return r; }
        }
    }

    public static class RazorpayOrderResponse {
        private String razorpayOrderId;
        private BigDecimal amount;
        private String currency;
        private String keyId;

        public RazorpayOrderResponse() {}
        public String getRazorpayOrderId() { return razorpayOrderId; }
        public BigDecimal getAmount() { return amount; }
        public String getCurrency() { return currency; }
        public String getKeyId() { return keyId; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final RazorpayOrderResponse r = new RazorpayOrderResponse();
            public Builder razorpayOrderId(String v) { r.razorpayOrderId = v; return this; }
            public Builder amount(BigDecimal v) { r.amount = v; return this; }
            public Builder currency(String v) { r.currency = v; return this; }
            public Builder keyId(String v) { r.keyId = v; return this; }
            public RazorpayOrderResponse build() { return r; }
        }
    }

    public static class PaymentVerifyRequest {
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;

        public String getRazorpayOrderId() { return razorpayOrderId; }
        public void setRazorpayOrderId(String v) { this.razorpayOrderId = v; }
        public String getRazorpayPaymentId() { return razorpayPaymentId; }
        public void setRazorpayPaymentId(String v) { this.razorpayPaymentId = v; }
        public String getRazorpaySignature() { return razorpaySignature; }
        public void setRazorpaySignature(String v) { this.razorpaySignature = v; }
    }
}
