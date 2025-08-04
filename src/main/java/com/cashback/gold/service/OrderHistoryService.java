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
import com.cashback.gold.dto.OrnamentPaymentCallbackRequest;
import com.cashback.gold.entity.*;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.*;
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

import java.math.BigDecimal;
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
    private final MetalRateRepository metalRateRepository;
    private final RazorpayService razorpayService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${commission.level1}")
    private double level1Commission;

    @Value("${commission.level2}")
    private double level2Commission;

    @Value("${commission.level3}")
    private double level3Commission;

    @Value("${ornament.gst.rate}")
    private double ornamentGstRate;

    @Value("${ornament.discount.firstOrder}")
    private double firstOrderDiscountRate;

    @Value("${ornament.cgst.rate}")
    private double cgstRate;

    @Value("${ornament.sgst.rate}")
    private double sgstRate;

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

//    @Transactional
//    public Map<String, Object> createOrnamentOrderFromCart(UserPrincipal user) {
//        List<CartItem> cartItems = cartRepo.findByUserId(user.getId());
//        if (cartItems.isEmpty()) {
//            throw new InvalidArgumentException("Cart is empty");
//        }
//
//        double total = 0.0;
//        StringBuilder items = new StringBuilder();
//
//        for (CartItem item : cartItems) {
//            Ornament ornament = item.getOrnament();
//            if (ornament == null || item.getQuantity() <= 0) {
//                throw new InvalidArgumentException("Invalid cart item: missing ornament or invalid quantity");
//            }
//
//            // Use stored price and calculate item-wise GST
//            double basePrice = ornament.getTotalPrice() * item.getQuantity();
//            if (basePrice <= 0) {
//                throw new InvalidArgumentException("Invalid price for ornament: " + ornament.getName());
//            }
//
//            double itemGst = Math.round(basePrice * ornamentGstRate * 100.0) / 100.0;
//            double finalItemPrice = basePrice + itemGst;
//
//            total += finalItemPrice;
//            items.append(ornament.getName()).append(" x").append(item.getQuantity()).append(", ");
//        }
//
//        String itemSummary = items.toString().replaceAll(", $", "");
//
//        String address = userRepository.findById(user.getId())
//                .map(u -> String.join(", ",
//                        u.getTown() != null ? u.getTown() : "",
//                        u.getCity() != null ? u.getCity() : "",
//                        u.getState() != null ? u.getState() : "",
//                        u.getCountry() != null ? u.getCountry() : ""))
//                .orElseThrow(() -> new InvalidArgumentException("User address not found"));
//
//        boolean isFirstOrder = repository.countByUserId(user.getId()) == 0;
//        double discount = isFirstOrder ? Math.round(total * firstOrderDiscountRate * 100.0) / 100.0 : 0.0;
//
//        double subtotal = total - discount;
//        double cgst = Math.round(subtotal * cgstRate * 100.0) / 100.0;
//        double sgst = Math.round(subtotal * sgstRate * 100.0) / 100.0;
//        double gst = cgst + sgst;
//
//        double finalAmount = subtotal + gst;
//        if (finalAmount <= 0) {
//            throw new InvalidArgumentException("Final amount must be greater than zero");
//        }
//
//        OrderHistory order = OrderHistory.builder()
//                .orderId("ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
//                .userId(user.getId())
//                .customerName(user.getUsername())
//                .customerType(user.getRole().toLowerCase())
//                .planType("ORNAMENT")
//                .planName(itemSummary)
//                .duration("-")
//                .amount(finalAmount)
//                .paymentMethod("PENDING")
//                .status("pending")
//                .address(address)
//                .createdAt(LocalDateTime.now())
//                .cgst(cgst)
//                .sgst(sgst)
//                .gst(gst)
//                .build();
//
//        OrderHistory savedOrder = repository.save(order);
//        cartRepo.deleteByUserId(user.getId());
//
//        User userEntity = userRepository.findById(user.getId())
//                .orElseThrow(() -> new InvalidArgumentException("User not found"));
//
//        // ✅ Only apply commission if it's the first order
//        if (isFirstOrder) {
//            Long currentReferrerId = userEntity.getReferredBy();
//            int level = 1;
//
//            while (currentReferrerId != null && level <= 3) {
//                Optional<User> referrerOpt = userRepository.findById(currentReferrerId);
//                if (referrerOpt.isEmpty() || !"PARTNER".equalsIgnoreCase(referrerOpt.get().getRole())) {
//                    break;
//                }
//
//                User referrer = referrerOpt.get();
//                double commissionPercent = switch (level) {
//                    case 1 -> level1Commission;
//                    case 2 -> level2Commission;
//                    case 3 -> level3Commission;
//                    default -> 0.0;
//                };
//
//                double commissionAmount = Math.round(finalAmount * commissionPercent * 100.0) / 100.0;
//
//                Commission commission = Commission.builder()
//                        .partnerId(referrer.getId())
//                        .userId(userEntity.getId())
//                        .orderType("ORNAMENT")
//                        .orderAmount(finalAmount)
//                        .commissionAmount(commissionAmount)
//                        .level(level)
//                        .createdAt(LocalDateTime.now())
//                        .build();
//
//                commissionRepo.save(commission);
//                currentReferrerId = referrer.getReferredBy();
//                level++;
//            }
//        }
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("order", savedOrder);
//        response.put("amount", finalAmount);
//        response.put("discount", discount);
//        response.put("cgst", cgst);
//        response.put("sgst", sgst);
//        response.put("gst", gst);
//
//        return response;
//    }

    @Transactional
    public Map<String, Object> initiateCheckoutOrnamentCart(UserPrincipal user) {
        List<CartItem> cartItems = cartRepo.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new InvalidArgumentException("Cart is empty");
        }

        double total = 0.0;
        StringBuilder items = new StringBuilder();

        for (CartItem item : cartItems) {
            Ornament ornament = item.getOrnament();
            if (ornament == null || item.getQuantity() <= 0) {
                throw new InvalidArgumentException("Invalid cart item");
            }

            double basePrice = ornament.getTotalPrice() * item.getQuantity();
            double itemGst = Math.round(basePrice * ornamentGstRate * 100.0) / 100.0;
            total += basePrice + itemGst;
            items.append(ornament.getName()).append(" x").append(item.getQuantity()).append(", ");
        }

        String itemSummary = items.toString().replaceAll(", $", "");
        String address = userRepository.findById(user.getId()).map(u ->
                String.join(", ", u.getTown(), u.getCity(), u.getState(), u.getCountry())
        ).orElseThrow(() -> new InvalidArgumentException("User address not found"));

        boolean isFirstOrder = repository.countByUserId(user.getId()) == 0;
        double discount = isFirstOrder ? Math.round(total * firstOrderDiscountRate * 100.0) / 100.0 : 0.0;
        double subtotal = total - discount;
        double cgst = Math.round(subtotal * cgstRate * 100.0) / 100.0;
        double sgst = Math.round(subtotal * sgstRate * 100.0) / 100.0;
        double gst = cgst + sgst;
        double finalAmount = subtotal + gst;

        String receiptId = "ORN-" + UUID.randomUUID();

        Order razorpayOrder = razorpayService.createOrder(BigDecimal.valueOf(finalAmount), receiptId);
        razorpayService.savePayment(razorpayOrder.get("id"), null, null, BigDecimal.valueOf(finalAmount), "ORNAMENTS", null);

        OrderHistory order = OrderHistory.builder()
                .orderId(receiptId)
                .userId(user.getId())
                .customerName(user.getUsername())
                .razorpayOrderId(razorpayOrder.get("id").toString())
                .customerType(user.getRole().toLowerCase())
                .planType("ORNAMENT")
                .planName(itemSummary)
                .duration("-")
                .amount(finalAmount)
                .paymentMethod("PENDING")
                .status("pending")
                .address(address)
                .createdAt(LocalDateTime.now())
                .cgst(cgst)
                .sgst(sgst)
                .gst(gst)
                .build();

        repository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", razorpayOrder.get("id"));
        response.put("amount", finalAmount);
        response.put("currency", "INR");
        response.put("key", razorpayService.getKeyId());
        response.put("receipt", receiptId);

        return response;
    }

    @Transactional
    public RazorpayPayment verifyCheckoutOrnamentPayment(OrnamentPaymentCallbackRequest request, UserPrincipal user) {
        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            throw new InvalidArgumentException("Invalid payment signature");
        }

        RazorpayPayment saved = razorpayService.savePayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                request.getAmount(),
                "ORNAMENTS",
                null
        );

        OrderHistory order = repository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new InvalidArgumentException("Order not found"));

        order.setStatus("confirmed");
        order.setPaymentMethod("RAZORPAY");
        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setRazorpayOrderId(request.getRazorpayOrderId());
        order.setRazorpaySignature(request.getRazorpaySignature());
        repository.save(order);

        cartRepo.deleteByUserId(user.getId());

        User userEntity = userRepository.findById(user.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        boolean isFirstOrder = commissionRepo.countByUserId(user.getId()) == 0;

        if (isFirstOrder) {
            Long referrerId = userEntity.getReferredBy();
            int level = 1;
            while (referrerId != null && level <= 3) {
                Optional<User> refOpt = userRepository.findById(referrerId);
                if (refOpt.isEmpty() || !"PARTNER".equalsIgnoreCase(refOpt.get().getRole())) break;

                User ref = refOpt.get();
                double percent = switch (level) {
                    case 1 -> level1Commission;
                    case 2 -> level2Commission;
                    case 3 -> level3Commission;
                    default -> 0.0;
                };

                double commissionAmt = Math.round(request.getAmount().doubleValue() * percent * 100.0) / 100.0;
                Commission c = Commission.builder()
                        .partnerId(ref.getId())
                        .userId(user.getId())
                        .orderType("ORNAMENT")
                        .orderAmount(request.getAmount().doubleValue())
                        .commissionAmount(commissionAmt)
                        .level(level)
                        .createdAt(LocalDateTime.now())
                        .build();
                commissionRepo.save(c);
                referrerId = ref.getReferredBy();
                level++;
            }
        }

        return saved;
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