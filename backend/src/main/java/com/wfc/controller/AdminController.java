package com.wfc.controller;

import com.wfc.dto.OrderDto;
import com.wfc.dto.ProductDto;
import com.wfc.service.OrderService;
import com.wfc.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private ProductService productService;
    @Autowired private OrderService orderService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto.Response>> getAllProducts() {
        return ResponseEntity.ok(productService.getAll());
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto.Response> createProduct(@Valid @RequestBody ProductDto.Request req) {
        return ResponseEntity.ok(productService.create(req));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto.Response> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto.Request req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto.Response>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto.Response> updateOrderStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }
}
