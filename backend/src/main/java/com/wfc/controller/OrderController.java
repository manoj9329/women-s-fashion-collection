package com.wfc.controller;

import com.wfc.dto.OrderDto;
import com.wfc.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto.RazorpayOrderResponse> createOrder(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody OrderDto.CreateRequest req) throws Exception {
        return ResponseEntity.ok(orderService.createOrder(user.getUsername(), req));
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<OrderDto.Response> verifyPayment(@RequestBody OrderDto.PaymentVerifyRequest req) throws Exception {
        return ResponseEntity.ok(orderService.verifyPayment(req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderDto.Response>> myOrders(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getUsername()));
    }
}
