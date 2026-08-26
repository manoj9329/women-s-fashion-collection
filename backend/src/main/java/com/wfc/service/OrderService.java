package com.wfc.service;

import com.wfc.dto.OrderDto;
import com.wfc.entity.*;
import com.wfc.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Transactional
    public OrderDto.RazorpayOrderResponse createOrder(String email, OrderDto.CreateRequest req) throws Exception {
        User user = userRepository.findByEmail(email).orElseThrow();

        List<OrderItem> items = new ArrayList<>();
        for (OrderDto.ItemRequest itemReq : req.getItems()) {
            Product p = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            OrderItem item = OrderItem.builder()
                    .product(p).quantity(itemReq.getQuantity())
                    .size(itemReq.getSize()).color(itemReq.getColor())
                    .unitPrice(p.getPrice()).build();
            items.add(item);
        }

        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(new BigDecimal("1999")) < 0)
            total = total.add(new BigDecimal("99"));

        String rzpOrderId = "rzp_order_" + System.currentTimeMillis();

        Order order = Order.builder()
                .user(user).totalAmount(total)
                .razorpayOrderId(rzpOrderId)
                .shippingAddress(req.getShippingAddress())
                .status(Order.Status.PENDING).build();
        order.setItems(items);

        Order saved = orderRepository.save(order);
        for (OrderItem i : items) i.setOrder(saved);

        return OrderDto.RazorpayOrderResponse.builder()
                .razorpayOrderId(rzpOrderId)
                .amount(total).currency("INR").keyId(razorpayKeyId)
                .build();
    }

    @Transactional
    public OrderDto.Response verifyPayment(OrderDto.PaymentVerifyRequest req) throws Exception {
        String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256"));
        String generated = HexFormat.of().formatHex(mac.doFinal(payload.getBytes()));

        if (!generated.equals(req.getRazorpaySignature()))
            throw new RuntimeException("Payment verification failed");

        Order order = orderRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.Status.PAID);
        order.setRazorpayPaymentId(req.getRazorpayPaymentId());
        return toResponse(orderRepository.save(order));
    }

    public List<OrderDto.Response> getUserOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<OrderDto.Response> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public OrderDto.Response updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(Order.Status.valueOf(status));
        return toResponse(orderRepository.save(order));
    }

    private OrderDto.Response toResponse(Order o) {
        List<OrderDto.ItemResponse> items = o.getItems() == null ? List.of() :
                o.getItems().stream().map(i -> OrderDto.ItemResponse.builder()
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .imageUrl(i.getProduct().getImageUrl())
                        .quantity(i.getQuantity()).size(i.getSize()).color(i.getColor())
                        .unitPrice(i.getUnitPrice()).build()).toList();
        return OrderDto.Response.builder()
                .id(o.getId()).items(items).totalAmount(o.getTotalAmount())
                .status(o.getStatus().name()).razorpayOrderId(o.getRazorpayOrderId())
                .shippingAddress(o.getShippingAddress()).createdAt(o.getCreatedAt())
                .build();
    
        
    }
}
