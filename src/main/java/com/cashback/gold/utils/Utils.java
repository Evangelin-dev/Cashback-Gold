package com.cashback.gold.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class Utils {

    public static String sign(String data, String key) throws RuntimeException {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKey);
            byte[] hashBytes = mac.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC SHA256 signature", e);
        }
    }
}

