package com.cashback.gold.service;

import com.cashback.gold.dto.NomineeRequest;
import com.cashback.gold.dto.NomineeResponse;
import com.cashback.gold.entity.Nominee;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.NomineeRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NomineeService {

    private final NomineeRepository nomineeRepository;
    private final UserRepository userRepository;

    public NomineeResponse addNominee(UserPrincipal principal, NomineeRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        Nominee nominee = Nominee.builder()
                .fullName(request.getFullName())
                .relationship(request.getRelationship())
                .dob(request.getDob())
                .gender(request.getGender())
                .user(user)
                .build();

        nominee = nomineeRepository.save(nominee);

        return new NomineeResponse(
                nominee.getId(),
                nominee.getFullName(),
                nominee.getRelationship(),
                nominee.getDob(),
                nominee.getGender()
        );
    }

    public List<NomineeResponse> getNominees(UserPrincipal principal) {
        return nomineeRepository.findByUserId(principal.getId())
                .stream()
                .map(n -> new NomineeResponse(n.getId(), n.getFullName(), n.getRelationship(), n.getDob(), n.getGender()))
                .collect(Collectors.toList());
    }
}
