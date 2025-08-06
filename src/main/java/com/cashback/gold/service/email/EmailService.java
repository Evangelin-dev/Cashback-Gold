package com.cashback.gold.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("OTP Verification - Cashback Gold");
            helper.setText("Your OTP is: <b>" + otp + "</b>. It will expire in 5 minutes.", true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    public void sendContactMessageEmail(String fromEmail, String name, String phone, String messageText) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from); // app email
            helper.setTo(from); // admin/support email
            helper.setSubject("New Contact Us Message - Cashback Gold");

            String content = "<p><b>Name:</b> " + name + "</p>"
                    + "<p><b>Email:</b> " + fromEmail + "</p>"
                    + "<p><b>Phone:</b> " + phone + "</p>"
                    + "<p><b>Message:</b><br/>" + messageText + "</p>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send contact message email", e);
        }
    }

}
