package com.cashback.gold.service;

import com.cashback.gold.dto.ornament.OrnamentRequest;
import com.cashback.gold.dto.ornament.OrnamentResponse;
import com.cashback.gold.dto.ornament.PriceBreakupDTO;
import com.cashback.gold.entity.Ornament;
import com.cashback.gold.entity.PriceBreakup;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.OrnamentRepository;
import com.cashback.gold.repository.PriceBreakupRepository;
import com.cashback.gold.service.aws.S3Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrnamentService {

    private final OrnamentRepository repo;
    private final PriceBreakupRepository priceBreakupRepo;
    private final S3Service s3Service;
    private final ObjectMapper objectMapper;

    public OrnamentResponse getById(Long id) {
        Ornament ornament = repo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found with id: " + id));
        return toResponse(ornament);
    }

    public List<OrnamentResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repo.findAll(pageable)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrnamentResponse create(MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
        OrnamentRequest req = parse(dataJson);

        Ornament ornament = toEntity(req);

        // Upload main image
        ornament.setMainImage(s3Service.uploadFile(mainImage));

        // Upload and assign sub images (max 4)
        assignSubImages(ornament, subImages);

        // Set price breakups
        if (req.getPriceBreakups() != null) {
            List<PriceBreakup> priceBreakups = req.getPriceBreakups().stream()
                    .map(dto -> toPriceBreakupEntity(dto, ornament))
                    .collect(Collectors.toList());
            ornament.setPriceBreakups(priceBreakups);
        }

        return toResponse(repo.save(ornament));
    }

    public OrnamentResponse update(Long id, MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
        OrnamentRequest req = parse(dataJson);
        Ornament ornament = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));

        updateEntity(ornament, req);

        if (mainImage != null && !mainImage.isEmpty()) {
            ornament.setMainImage(s3Service.uploadFile(mainImage));
        }

        if (subImages != null && !subImages.isEmpty()) {
            assignSubImages(ornament, subImages);
        }

        // Update price breakups safely
        if (req.getPriceBreakups() != null) {
            ornament.getPriceBreakups().clear();
            for (PriceBreakupDTO dto : req.getPriceBreakups()) {
                PriceBreakup breakup = toPriceBreakupEntity(dto, ornament);
                ornament.getPriceBreakups().add(breakup);
            }
        }

        return toResponse(repo.save(ornament));
    }

    public void delete(Long id) {
        Ornament ornament = repo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found with id: " + id));

        // Delete main image from S3
        if (ornament.getMainImage() != null) {
            s3Service.deleteFile(ornament.getMainImage());
        }

        // Delete all sub images from S3
        if (ornament.getSubImage1() != null) s3Service.deleteFile(ornament.getSubImage1());
        if (ornament.getSubImage2() != null) s3Service.deleteFile(ornament.getSubImage2());
        if (ornament.getSubImage3() != null) s3Service.deleteFile(ornament.getSubImage3());
        if (ornament.getSubImage4() != null) s3Service.deleteFile(ornament.getSubImage4());

        // Now delete ornament from DB
        repo.deleteById(id);
    }


    private OrnamentRequest parse(String json) {
        try {
            return objectMapper.readValue(json, OrnamentRequest.class);
        } catch (Exception e) {
            throw new InvalidArgumentException("Invalid JSON: " + e.getMessage());
        }
    }

    private Ornament toEntity(OrnamentRequest r) {
        return Ornament.builder()
                .name(r.getName()).price(r.getPrice())
                .category(r.getCategory()).subCategory(r.getSubCategory()).gender(r.getGender())
                .description1(r.getDescription1()).description2(r.getDescription2()).description3(r.getDescription3())
                .description(r.getDescription()).material(r.getMaterial())
                .purity(r.getPurity()).quality(r.getQuality()).warranty(r.getWarranty()) // Added warranty
                .details(r.getDetails())
                .build();
    }

    private void updateEntity(Ornament o, OrnamentRequest r) {
        o.setName(r.getName()); o.setPrice(r.getPrice());
        o.setCategory(r.getCategory()); o.setSubCategory(r.getSubCategory()); o.setGender(r.getGender());
        o.setDescription1(r.getDescription1()); o.setDescription2(r.getDescription2()); o.setDescription3(r.getDescription3());
        o.setDescription(r.getDescription()); o.setMaterial(r.getMaterial());
        o.setPurity(r.getPurity()); o.setQuality(r.getQuality()); o.setWarranty(r.getWarranty()); // Added warranty
        o.setDetails(r.getDetails());
    }

    private void assignSubImages(Ornament ornament, List<MultipartFile> subImages) {
        // Step 1: Null or empty check
        if (subImages == null || subImages.isEmpty()) {
            throw new InvalidArgumentException("All 4 subImages (subImage1 to subImage4) are required.");
        }

        // Step 2: Validate content types before upload
        for (int i = 0; i < subImages.size(); i++) {
            MultipartFile file = subImages.get(i);
            if (file == null || file.isEmpty()) {
                throw new InvalidArgumentException("subImage" + (i + 1) + " is missing.");
            }
            if (!isValidImage(file)) {
                throw new InvalidArgumentException("subImage" + (i + 1) + " must be a valid image (jpeg/png/webp).");
            }
        }

        // Step 3: Ensure exactly 4 sub images are provided
        if (subImages.size() < 4) {
            throw new InvalidArgumentException("Exactly 4 subImages are required.");
        }

        // Step 4: Upload only after validation
        List<String> urls = subImages.stream()
                .map(s3Service::uploadFile)
                .toList();

        ornament.setSubImage1(urls.get(0));
        ornament.setSubImage2(urls.get(1));
        ornament.setSubImage3(urls.get(2));
        ornament.setSubImage4(urls.get(3));
    }

    private boolean isValidImage(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/webp")
        );
    }


    private OrnamentResponse toResponse(Ornament o) {
        return OrnamentResponse.builder()
                .id(o.getId()).name(o.getName()).price(o.getPrice())
                .category(o.getCategory()).subCategory(o.getSubCategory()).gender(o.getGender())
                .description1(o.getDescription1()).description2(o.getDescription2()).description3(o.getDescription3())
                .description(o.getDescription()).mainImage(o.getMainImage())
                .subImages(List.of(
                        o.getSubImage1(),
                        o.getSubImage2(),
                        o.getSubImage3(),
                        o.getSubImage4()
                ).stream().filter(url -> url != null).collect(Collectors.toList()))
                .material(o.getMaterial()).purity(o.getPurity()).quality(o.getQuality())
                .warranty(o.getWarranty()) // Added warranty
                .details(o.getDetails())
                .priceBreakups(o.getPriceBreakups().stream()
                        .map(this::toPriceBreakupDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private PriceBreakup toPriceBreakupEntity(PriceBreakupDTO dto, Ornament ornament) {
        return PriceBreakup.builder()
                .id(dto.getId())
                .ornament(ornament)
                .component(dto.getComponent())
                .goldRate18kt(dto.getGoldRate18kt())
                .weightG(dto.getWeightG())
                .discount(dto.getDiscount())
                .finalValue(dto.getFinalValue())
                .build();
    }

    private PriceBreakupDTO toPriceBreakupDTO(PriceBreakup entity) {
        return PriceBreakupDTO.builder()
                .id(entity.getId())
                .component(entity.getComponent())
                .goldRate18kt(entity.getGoldRate18kt())
                .weightG(entity.getWeightG())
                .discount(entity.getDiscount())
                .finalValue(entity.getFinalValue())
                .build();
    }
}