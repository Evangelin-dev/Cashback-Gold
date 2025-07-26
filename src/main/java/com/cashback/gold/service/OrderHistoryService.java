//package com.cashback.gold.service;
//
//import com.cashback.gold.dto.OrderRequest;
//import com.cashback.gold.entity.CartItem;
//import com.cashback.gold.entity.Commission;
//import com.cashback.gold.entity.OrderHistory;
//import com.cashback.gold.entity.User;
//import com.cashback.gold.exception.InvalidArgumentException;
//import com.cashback.gold.repository.CartItemRepository;
//import com.cashback.gold.repository.CommissionRepository;
//import com.cashback.gold.repository.OrderHistoryRepository;
//import com.cashback.gold.repository.UserRepository;
//import com.cashback.gold.security.UserPrincipal;
//import jakarta.persistence.criteria.Predicate;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class OrderHistoryService {
//
//    private final OrderHistoryRepository repository;
//    private final UserRepository userRepository;
//    private final CartItemRepository cartRepo;
//    private final CommissionRepository commissionRepo;
//
//    @Transactional
//    public OrderHistory createOrderFromUser(OrderRequest request, UserPrincipal userPrincipal) {
//        User user = userRepository.findById(userPrincipal.getId())
//                .orElseThrow(() -> new InvalidArgumentException("User not found"));
//
//        String fullAddress = String.join(", ",
//                user.getTown(), user.getCity(), user.getState(), user.getCountry());
//
//        OrderHistory order = OrderHistory.builder()
//                .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
//                .userId(user.getId())
//                .customerName(user.getFullName())
//                .customerType(user.getRole().toLowerCase())
//                .planType(request.getPlanType())
//                .planName(request.getPlanName())
//                .duration(request.getDuration())
//                .amount(request.getAmount())
//                .paymentMethod(request.getPaymentMethod())
//                .status("pending")
//                .address(fullAddress)
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        if (user.getReferredBy() != null) {
//            Commission commission = Commission.builder()
//                    .partnerId(user.getReferredBy())
//                    .userId(user.getId())
//                    .orderType(request.getPlanType())
//                    .orderAmount(request.getAmount())
//                    .commissionAmount(request.getAmount() * 0.10)
//                    .createdAt(LocalDateTime.now())
//                    .build();
//            commissionRepo.save(commission);
//        }
//
//        return repository.save(order);
//
//    }
//
//
//    public Optional<OrderHistory> getOrderById(Long id) {
//        return repository.findById(id);
//    }
//
//    public Map<String, Object> getAllOrdersWithFilters(
//            int page, int size,
//            String customerType, String planType, String status,
//            String keyword, String startDate, String endDate
//    ) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//
//        Specification<OrderHistory> spec = (root, query, cb) -> {
//            List<Predicate> predicates = new ArrayList<>();
//
//            if (customerType != null) predicates.add(cb.equal(root.get("customerType"), customerType));
//            if (planType != null) predicates.add(cb.equal(root.get("planType"), planType));
//            if (status != null) predicates.add(cb.equal(root.get("status"), status));
//            if (keyword != null) {
//                String like = "%" + keyword.toLowerCase() + "%";
//                predicates.add(cb.or(
//                        cb.like(cb.lower(root.get("customerName")), like),
//                        cb.like(cb.lower(root.get("orderId")), like),
//                        cb.like(cb.lower(root.get("planName")), like)
//                ));
//            }
//            if (startDate != null) {
//                LocalDateTime from = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE).atStartOfDay();
//                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
//            }
//            if (endDate != null) {
//                LocalDateTime to = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE).atTime(23, 59, 59);
//                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
//            }
//
//            return cb.and(predicates.toArray(new Predicate[0]));
//        };
//
//        Page<OrderHistory> result = repository.findAll(spec, pageable);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("content", result.getContent());
//        response.put("totalElements", result.getTotalElements());
//        response.put("totalPages", result.getTotalPages());
//        response.put("currentPage", result.getNumber());
//
//        return response;
//    }
//
//    public List<OrderHistory> getOrdersByUserId(Long userId) {
//        return repository.findByUserId(userId);
//    }
//
//    @Transactional
//    public OrderHistory createOrnamentOrderFromCart(UserPrincipal user) {
//        List<CartItem> cartItems = cartRepo.findByUserId(user.getId());
//        if (cartItems.isEmpty()) throw new InvalidArgumentException("Cart is empty");
//
//        Double total = cartItems.stream()
//                .mapToDouble(item -> item.getOrnament().getPrice() * item.getQuantity())
//                .sum();
//
//        String items = cartItems.stream()
//                .map(item -> item.getOrnament().getName() + " x" + item.getQuantity())
//                .collect(Collectors.joining(", "));
//
//        String address = userRepository.findById(user.getId())
//                .map(u -> String.join(", ", u.getTown(), u.getCity(), u.getState(), u.getCountry()))
//                .orElse("Unknown");
//
//        OrderHistory order = OrderHistory.builder()
//                .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
//                .userId(user.getId())
//                .customerName(user.getUsername())
//                .customerType(user.getRole().toLowerCase())
//                .planType("ORNAMENT")
//                .planName(items)
//                .duration("-")
//                .amount(total)
//                .paymentMethod("COD") // or Razorpay later
//                .status("pending")
//                .address(address)
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        cartRepo.deleteByUserId(user.getId());
//
//        User userEntity = userRepository.findById(user.getId()).orElseThrow();
//        if (userEntity.getReferredBy() != null) {
//            Commission commission = Commission.builder()
//                    .partnerId(userEntity.getReferredBy())
//                    .userId(userEntity.getId())
//                    .orderType("ORNAMENT")
//                    .orderAmount(total)
//                    .commissionAmount(total * 0.10)
//                    .createdAt(LocalDateTime.now())
//                    .build();
//            commissionRepo.save(commission);
//        }
//
//        return repository.save(order);
//    }
//
//}



package com.cashback.gold.service;

import com.cashback.gold.dto.OrderRequest;
import com.cashback.gold.entity.CartItem;
import com.cashback.gold.entity.Commission;
import com.cashback.gold.entity.OrderHistory;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.CartItemRepository;
import com.cashback.gold.repository.CommissionRepository;
import com.cashback.gold.repository.OrderHistoryRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.utils.Utils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderHistoryService {

    private final OrderHistoryRepository repository;
    private final UserRepository userRepository;
    private final CartItemRepository cartRepo;
    private final CommissionRepository commissionRepo;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Transactional
    public Map<String, Object> createOrderFromUser(OrderRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        String fullAddress = String.join(", ",
                user.getTown(), user.getCity(), user.getState(), user.getCountry());

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 10));

            Order razorpayOrder = razorpay.orders.create(orderRequest);

            OrderHistory order = OrderHistory.builder()
                    .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                    .userId(user.getId())
                    .customerName(user.getFullName())
                    .customerType(user.getRole().toLowerCase())
                    .planType(request.getPlanType())
                    .planName(request.getPlanName())
                    .duration(request.getDuration())
                    .amount(request.getAmount())
                    .paymentMethod("RAZORPAY")
                    .status("pending")
                    .address(fullAddress)
                    .createdAt(LocalDateTime.now())
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .receiptId(razorpayOrder.get("receipt"))
                    .paymentStatus("created")
                    .build();

            if (user.getReferredBy() != null) {
                Commission commission = Commission.builder()
                        .partnerId(user.getReferredBy())
                        .userId(user.getId())
                        .orderType(request.getPlanType())
                        .orderAmount(request.getAmount())
                        .commissionAmount(request.getAmount() * 0.10)
                        .createdAt(LocalDateTime.now())
                        .build();
                commissionRepo.save(commission);
            }

            OrderHistory savedOrder = repository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("order", savedOrder);
            response.put("razorpayOrderId", razorpayOrder.get("id"));
            response.put("amount", request.getAmount() * 100);
            response.put("currency", "INR");
            response.put("key", razorpayKeyId);

            return response;

        } catch (RazorpayException e) {
            throw new InvalidArgumentException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    public Optional<OrderHistory> getOrderById(Long id) {
        return repository.findById(id);
    }

    public Map<String, Object> getAllOrdersWithFilters(
            int page, int size,
            String customerType, String planType, String status,
            String keyword, String startDate, String endDate
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Specification<OrderHistory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (customerType != null) predicates.add(cb.equal(root.get("customerType"), customerType));
            if (planType != null) predicates.add(cb.equal(root.get("planType"), planType));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            if (keyword != null) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("customerName")), like),
                        cb.like(cb.lower(root.get("orderId")), like),
                        cb.like(cb.lower(root.get("planName")), like)
                ));
            }
            if (startDate != null) {
                LocalDateTime from = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE).atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (endDate != null) {
                LocalDateTime to = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE).atTime(23, 59, 59);
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<OrderHistory> result = repository.findAll(spec, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", result.getContent());
        response.put("totalElements", result.getTotalElements());
        response.put("totalPages", result.getTotalPages());
        response.put("currentPage", result.getNumber());

        return response;
    }

    public List<OrderHistory> getOrdersByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    @Transactional
    public Map<String, Object> createOrnamentOrderFromCart(UserPrincipal user) {
        List<CartItem> cartItems = cartRepo.findByUserId(user.getId());
        if (cartItems.isEmpty()) throw new InvalidArgumentException("Cart is empty");

        Double total = cartItems.stream()
                .mapToDouble(item -> item.getOrnament().getPrice() * item.getQuantity())
                .sum();

        String items = cartItems.stream()
                .map(item -> item.getOrnament().getName() + " x" + item.getQuantity())
                .collect(Collectors.joining(", "));

        String address = userRepository.findById(user.getId())
                .map(u -> String.join(", ", u.getTown(), u.getCity(), u.getState(), u.getCountry()))
                .orElse("Unknown");

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", total * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 10));

            Order razorpayOrder = razorpay.orders.create(orderRequest);

            OrderHistory order = OrderHistory.builder()
                    .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                    .userId(user.getId())
                    .customerName(user.getUsername())
                    .customerType(user.getRole().toLowerCase())
                    .planType("ORNAMENT")
                    .planName(items)
                    .duration("-")
                    .amount(total)
                    .paymentMethod("RAZORPAY")
                    .status("pending")
                    .address(address)
                    .createdAt(LocalDateTime.now())
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .receiptId(razorpayOrder.get("receipt"))
                    .paymentStatus("created")
                    .build();

            cartRepo.deleteByUserId(user.getId());

            User userEntity = userRepository.findById(user.getId()).orElseThrow();
            if (userEntity.getReferredBy() != null) {
                Commission commission = Commission.builder()
                        .partnerId(userEntity.getReferredBy())
                        .userId(userEntity.getId())
                        .orderType("ORNAMENT")
                        .orderAmount(total)
                        .commissionAmount(total * 0.10)
                        .createdAt(LocalDateTime.now())
                        .build();
                commissionRepo.save(commission);
            }

            OrderHistory savedOrder = repository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("order", savedOrder);
            response.put("razorpayOrderId", razorpayOrder.get("id"));
            response.put("amount", total * 100);
            response.put("currency", "INR");
            response.put("key", razorpayKeyId);

            return response;

        } catch (RazorpayException e) {
            throw new InvalidArgumentException("Error creating Razorpay order: " + e.getMessage());
        }
    }
    public void verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            String generatedSignature = Utils.sign(
                    razorpayOrderId + "|" + razorpayPaymentId,
                    razorpayKeySecret
            );

            if (!generatedSignature.equals(razorpaySignature)) {
                throw new InvalidArgumentException("Invalid payment signature");
            }

            OrderHistory order = repository.findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new InvalidArgumentException("Order not found"));

            order.setRazorpayPaymentId(razorpayPaymentId);
            order.setRazorpaySignature(razorpaySignature);
            order.setPaymentStatus("success");
            order.setStatus("completed");

            repository.save(order);

        } catch (RazorpayException e) {
            throw new InvalidArgumentException("Error verifying payment: " + e.getMessage());
        }
    }
}