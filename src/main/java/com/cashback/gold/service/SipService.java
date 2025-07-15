package com.cashback.gold.service;

import com.cashback.gold.dto.SipRequest;
import com.cashback.gold.entity.Sip;
import com.cashback.gold.entity.User;
import com.cashback.gold.repository.SipRepository;
import com.cashback.gold.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SipService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SipRepository sipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Sip createSip(SipRequest request,Long b2bUserId) {
        // Create or find user
        User user = userRepository.findByEmailOrMobile(request.getEmail(), request.getMobile())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setFullName(request.getName());
                    newUser.setGender(request.getGender());
                    newUser.setDob(LocalDate.parse(request.getDob()));
                    newUser.setEmail(request.getEmail());
                    newUser.setMobile(request.getMobile());
                    newUser.setCountryCode(request.getCountryCode());
                    newUser.setCity("Unknown"); // Default for SIP customer
                    newUser.setTown("Unknown"); // Default for SIP customer
                    newUser.setState("Unknown"); // Default for SIP customer
                    newUser.setCountry("Unknown"); // Default for SIP customer
                    newUser.setPassword(passwordEncoder.encode(request.getPassword()));
                    newUser.setRole("USER");
                    newUser.setStatus("PENDING");
                    newUser.setCreatedAt(LocalDateTime.now());
                    newUser.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(newUser);
                });

        // Create SIP
        Sip sip = new Sip();
        sip.setUser(user);
        sip.setStartDate(LocalDate.parse(request.getStartDate()));
        sip.setAmount(request.getAmount());
        sip.setDuration(request.getDuration());
        sip.setPlan(request.getPlan());
        sip.setPlanName(request.getPlanName());
        sip.setStatus("ACTIVE");
        sip.setCommission("₹0");
        sip.setCreatedAt(LocalDateTime.now());
        sip.setUpdatedAt(LocalDateTime.now());
        sip.setCreatedBy(b2bUserId);
        return sipRepository.save(sip);
    }

    public Sip updateSip(Long sipId, SipRequest request) {
        Sip sip = sipRepository.findById(sipId)
                .orElseThrow(() -> new RuntimeException("SIP not found"));

        User user = sip.getUser();
        user.setFullName(request.getName());
        user.setGender(request.getGender());
        user.setDob(LocalDate.parse(request.getDob()));
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setCountryCode(request.getCountryCode());
        user.setCity(request.getCity());
        user.setTown(request.getTown());
        user.setState(request.getState());
        user.setCountry(request.getCountry());
        if (!request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        sip.setStartDate(LocalDate.parse(request.getStartDate()));
        sip.setAmount(request.getAmount());
        sip.setDuration(request.getDuration());
        sip.setPlan(request.getPlan());
        sip.setPlanName(request.getPlanName());
        sip.setUpdatedAt(LocalDateTime.now());

        return sipRepository.save(sip);
    }

    public List<Sip> getAllSips() {
        return sipRepository.findAll();
    }

    public List<Sip> searchSips(String query) {
        return sipRepository.searchSips(query);
    }

    public Sip changeSipStatus(Long sipId, String status) {
        Sip sip = sipRepository.findById(sipId)
                .orElseThrow(() -> new RuntimeException("SIP not found"));
        sip.setStatus(status);
        sip.setUpdatedAt(LocalDateTime.now());
        return sipRepository.save(sip);
    }

    public List<Sip> getSipsForUser(Long userId) {
        return sipRepository.findByUserId(userId);
    }

    public List<Sip> getSipsCreatedByB2BUser(Long b2bUserId) {
        return sipRepository.findByCreatedBy(b2bUserId);
    }


}
