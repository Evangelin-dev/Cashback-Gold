package com.cashback.gold.service;

import com.cashback.gold.dto.MarketingResourceRequest;
import com.cashback.gold.dto.MarketingResourceResponse;
import com.cashback.gold.entity.MarketingResource;
import com.cashback.gold.repository.MarketingResourceRepository;
import com.cashback.gold.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketingResourceService {

    private final MarketingResourceRepository resourceRepository;
    private final S3Service s3Service;

    public MarketingResourceResponse uploadResource(MarketingResourceRequest request, MultipartFile file) {
        String fileUrl = s3Service.uploadFile(file);

        MarketingResource resource = MarketingResource.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .fileName(file.getOriginalFilename())
                .fileType(getFileType(file.getOriginalFilename()))
                .fileUrl(fileUrl)
                .uploadDate(LocalDateTime.now())
                .status("ACTIVE")
                .downloadCount(0)
                .build();

        resource = resourceRepository.save(resource);

        return toResponse(resource);
    }

    public List<MarketingResourceResponse> getAll() {
        return resourceRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        resourceRepository.deleteById(id);
    }

    public void toggleStatus(Long id) {
        MarketingResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setStatus(resource.getStatus().equals("ACTIVE") ? "INACTIVE" : "ACTIVE");
        resourceRepository.save(resource);
    }

    public MarketingResourceResponse update(Long id, MarketingResourceRequest request) {
        MarketingResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setTitle(request.getTitle());
        resource.setDescription(request.getDescription());
        return toResponse(resourceRepository.save(resource));
    }

    private MarketingResourceResponse toResponse(MarketingResource resource) {
        return MarketingResourceResponse.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .description(resource.getDescription())
                .fileName(resource.getFileName())
                .fileType(resource.getFileType())
                .fileUrl(resource.getFileUrl())
                .uploadDate(resource.getUploadDate())
                .status(resource.getStatus())
                .downloadCount(resource.getDownloadCount())
                .build();
    }

    private String getFileType(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "UNKNOWN";
        return fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase();
    }
}
