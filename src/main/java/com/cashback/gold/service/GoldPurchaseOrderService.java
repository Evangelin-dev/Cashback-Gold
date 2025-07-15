package com.cashback.gold.service;

import com.cashback.gold.config.MetalApiProperties;
import com.cashback.gold.dto.GoldPurchaseRequest;
import com.cashback.gold.dto.MetalRatesResponse;
import com.cashback.gold.dto.OrderResponse;
import com.cashback.gold.entity.GoldPurchaseOrder;
import com.cashback.gold.entity.User;
import com.cashback.gold.repository.GoldPurchaseOrderRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoldPurchaseOrderService {

    private final GoldPurchaseOrderRepository repo;
    private final RestTemplate restTemplate;
    private final MetalApiProperties metalApiProperties;
    private final UserRepository userRepository;

    public double getCurrentGoldRate() {
        String url = metalApiProperties.getUrl() +
                "?api_key=" + metalApiProperties.getKey() +
                "&base=INR&currencies=XAU";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> body = response.getBody();

        if (body != null && Boolean.TRUE.equals(body.get("success"))) {
            Map<String, Double> rates = (Map<String, Double>) body.get("rates");
            double inrPerOunce = rates.get("INRXAU");
            return Math.round((inrPerOunce / 31.1035) * 100.0) / 100.0;
        }

        throw new RuntimeException("Failed to fetch gold rate");
    }

    public GoldPurchaseOrder createOrder(UserPrincipal userPrincipal, GoldPurchaseRequest req) {
        double rate = getCurrentGoldRate();
        double total = rate * req.getQuantity();

        User user = userRepository.findById(userPrincipal.getId()).get();
        GoldPurchaseOrder order = GoldPurchaseOrder.builder()
                .userId(userPrincipal.getId())
                .customerName(user.getFullName())
                .customerType(user.getRole())
                .quantity(req.getQuantity())
                .pricePerGram(rate)
                .totalAmount(total)
                .deliveryMethod(req.getDeliveryMethod())
                .paymentMethod(req.getPaymentMethod())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        return repo.save(order);
    }

    public List<GoldPurchaseOrder> getAllOrders() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public List<GoldPurchaseOrder> getUserOrders(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public GoldPurchaseOrder updateStatus(Long id, String status) {
        GoldPurchaseOrder order = repo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return repo.save(order);
    }
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<GoldPurchaseOrder> orders = getUserOrders(userId);
        return orders.stream().map(order -> OrderResponse.builder()
                .id("ORD" + order.getId())
                .date(order.getCreatedAt().toLocalDate().toString())
                .quantity(order.getQuantity() + "g")
                .total("₹" + String.format("%,.2f", order.getTotalAmount()))
                .status(order.getStatus())
                .invoice("invoice_ORD" + order.getId() + ".pdf")
                .build()).collect(Collectors.toList());
    }

    public MetalRatesResponse fetchGoldAndSilverRatesFromApi() {
        String url = metalApiProperties.getUrl() +
                "?api_key=" + metalApiProperties.getKey() +
                "&base=INR&currencies=XAU,XAG";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> body = response.getBody();

        if (body != null && Boolean.TRUE.equals(body.get("success"))) {
            Map<String, Double> rates = (Map<String, Double>) body.get("rates");

            double inrPerOunceGold = rates.get("INRXAU");
            double inrPerOunceSilver = rates.get("INRXAG");

            // Convert ounce to gram
            double goldInrPerGram = Math.round((inrPerOunceGold / 31.1035) * 100.0) / 100.0;
            double silverInrPerGram = Math.round((inrPerOunceSilver / 31.1035) * 100.0) / 100.0;

//            // Save both in DB
//            updateRate("GOLD", goldInrPerGram);
//            updateRate("SILVER", silverInrPerGram);

            return MetalRatesResponse.builder()
                    .goldRateInrPerGram(goldInrPerGram)
                    .silverRateInrPerGram(silverInrPerGram)
                    .fetchedAt(LocalDateTime.now())
                    .build();
        }

        throw new RuntimeException("Failed to fetch gold and silver rates");
    }

}

