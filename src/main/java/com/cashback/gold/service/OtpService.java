package com.cashback.gold.service;

import com.cashback.gold.entity.OtpVerification;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.OtpVerificationRepository;
import com.cashback.gold.service.email.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpRepo;
    private final EmailService emailService;
    private final SmsService smsService;

    @Transactional
    public void sendOtp(String identifier) {
        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(10);
        long recentCount = otpRepo.countRecentOtps(identifier, tenMinutesAgo);

        if (recentCount >= 3) {
            throw new InvalidArgumentException("Maximum OTP attempts exceeded. Please try again later.");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setIdentifier(identifier);
        otpVerification.setOtp(otp);
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpVerification.setVerified(false);
        otpVerification.setCreatedAt(LocalDateTime.now());
        otpRepo.save(otpVerification);

        if (identifier.contains("@")) {
            emailService.sendOtpEmail(identifier, otp);
        } else {
            smsService.sendOtpSms(identifier, otp);
        }
    }


    public boolean verifyOtp(String identifier, String otp) {
        OtpVerification record = otpRepo.findTopByIdentifierOrderByIdDesc(identifier)
                .orElseThrow(() -> new InvalidArgumentException("OTP not found"));

        if (!record.getOtp().equals(otp) || record.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        record.setVerified(true);
        otpRepo.save(record);
        return true;
    }
}