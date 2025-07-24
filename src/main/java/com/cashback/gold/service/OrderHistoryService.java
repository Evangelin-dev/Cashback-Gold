package com.cashback.gold.service;

import com.cashback.gold.dto.OrderRequest;
import com.cashback.gold.entity.CartItem;
import com.cashback.gold.entity.OrderHistory;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.CartItemRepository;
import com.cashback.gold.repository.OrderHistoryRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
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

    @Transactional
    public OrderHistory createOrderFromUser(OrderRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        String fullAddress = String.join(", ",
                user.getTown(), user.getCity(), user.getState(), user.getCountry());

        OrderHistory order = OrderHistory.builder()
                .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .userId(user.getId())
                .customerName(user.getFullName())
                .customerType(user.getRole().toLowerCase())
                .planType(request.getPlanType())
                .planName(request.getPlanName())
                .duration(request.getDuration())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status("pending")
                .address(fullAddress)
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(order);
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
    public OrderHistory createOrnamentOrderFromCart(UserPrincipal user) {
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

        OrderHistory order = OrderHistory.builder()
                .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .userId(user.getId())
                .customerName(user.getUsername())
                .customerType(user.getRole().toLowerCase())
                .planType("ORNAMENT")
                .planName(items)
                .duration("-")
                .amount(total)
                .paymentMethod("COD") // or Razorpay later
                .status("pending")
                .address(address)
                .createdAt(LocalDateTime.now())
                .build();

        cartRepo.deleteByUserId(user.getId());
        return repository.save(order);
    }

}
