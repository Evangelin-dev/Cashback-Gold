package com.cashback.gold.service;

import com.cashback.gold.entity.RazorpayPayment;
import com.cashback.gold.repository.RazorpayPaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayPaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String secretKey;

    public RazorpayClient getClient() {
        try {
            return new RazorpayClient(keyId, secretKey);
        } catch (RazorpayException e) {
            throw new RuntimeException("Unable to create Razorpay client", e);
        }
    }

    public Order createOrder(BigDecimal amount, String receiptId) {
        RazorpayClient client = getClient();
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue()); // converting to paisa
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId);

        try {
            return client.orders.create(orderRequest);
        } catch (RazorpayException e) {
            throw new RuntimeException("Order creation failed", e);
        }
    }

    public RazorpayPayment savePayment(String orderId, String paymentId, String signature,
                                       BigDecimal amount, String paymentType, Long enrollmentId) {
        RazorpayPayment payment = RazorpayPayment.builder()
                .razorpayOrderId(orderId)
                .razorpayPaymentId(paymentId)
                .razorpaySignature(signature)
                .amount(amount)
                .paymentType(paymentType)
                .enrollmentId(enrollmentId)
                .createdAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }


    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            Map<String, String> params = new HashMap<>();
            params.put("razorpay_order_id", razorpayOrderId);
            params.put("razorpay_payment_id", razorpayPaymentId);
            params.put("razorpay_signature", razorpaySignature);

            JSONObject jsonParams = new JSONObject(params);
            Utils.verifyPaymentSignature(jsonParams, secretKey); // Uses HMAC SHA256
            return true;
        } catch (RazorpayException e) {
            return false;
        }
    }
}
