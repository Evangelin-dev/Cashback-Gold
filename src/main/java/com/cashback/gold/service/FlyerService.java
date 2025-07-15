package com.cashback.gold.service;

import com.cashback.gold.dto.FlyerResponse;
import com.cashback.gold.entity.Flyer;
import com.cashback.gold.enums.FlyerType;
import com.cashback.gold.repository.FlyerRepository;
import com.cashback.gold.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlyerService {

    private final FlyerRepository flyerRepository;
    private final S3Service s3Service;

    public FlyerResponse upload(MultipartFile file, FlyerType type) {
        String url = s3Service.uploadFile(file);
        Flyer flyer = flyerRepository.save(Flyer.builder()
                .url(url)
                .type(type)
                .uploadDate(LocalDateTime.now())
                .build());

        return toResponse(flyer);
    }

    public List<FlyerResponse> getAll() {
        return flyerRepository.findAllByOrderByUploadDateDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Flyer flyer = flyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flyer not found"));
        s3Service.deleteFile(flyer.getUrl());
        flyerRepository.delete(flyer);
    }

    private FlyerResponse toResponse(Flyer flyer) {
        return FlyerResponse.builder()
                .id(flyer.getId())
                .url(flyer.getUrl())
                .type(flyer.getType())
                .uploadDate(flyer.getUploadDate())
                .build();
    }

    public List<FlyerResponse> getAllByType(FlyerType type) {
        return flyerRepository.findByTypeOrderByUploadDateDesc(type)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}

