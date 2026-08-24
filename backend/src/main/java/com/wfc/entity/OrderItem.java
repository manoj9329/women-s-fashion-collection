package com.wfc.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private String size;
    private String color;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    public OrderItem() {}

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final OrderItem i = new OrderItem();
        public Builder order(Order v) { i.order = v; return this; }
        public Builder product(Product v) { i.product = v; return this; }
        public Builder quantity(Integer v) { i.quantity = v; return this; }
        public Builder size(String v) { i.size = v; return this; }
        public Builder color(String v) { i.color = v; return this; }
        public Builder unitPrice(BigDecimal v) { i.unitPrice = v; return this; }
        public OrderItem build() { return i; }
    }
}
