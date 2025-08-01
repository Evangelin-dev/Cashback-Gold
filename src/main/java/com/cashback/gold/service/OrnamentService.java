package com.cashback.gold.service;

import com.cashback.gold.dto.ornament.OrnamentRequest;
import com.cashback.gold.dto.ornament.OrnamentResponse;
import com.cashback.gold.dto.ornament.PriceBreakupDTO;
import com.cashback.gold.entity.MetalRate;
import com.cashback.gold.entity.Ornament;
import com.cashback.gold.entity.PriceBreakup;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.MetalRateRepository;
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
    private final MetalRateRepository metalRateRepo;


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

        ornament.setMainImage(s3Service.uploadFile(mainImage));
        assignSubImages(ornament, subImages);

        List<PriceBreakup> priceBreakups = null;
        double basePrice = 0.0;
        double goldRate = metalRateRepo.findByMetalType("GOLD")
                .map(MetalRate::getRateInrPerGram)
                .orElseThrow(() -> new InvalidArgumentException("Gold rate not available"));
        if (req.getPriceBreakups() != null && !req.getPriceBreakups().isEmpty()) {


            priceBreakups = req.getPriceBreakups().stream()
                    .map(dto -> toPriceBreakupEntity(dto, ornament))
                    .toList();

            for (PriceBreakup pb : priceBreakups) {
                if (pb.getWeightG() != null && pb.getWeightG() > 0) {
                    basePrice += pb.getWeightG() * goldRate;
                }
//                else {
//                    basePrice += pb.getFinalValue() != null ? pb.getFinalValue() : 0;
//                }
            }

            ornament.setPriceBreakups(priceBreakups);
        }

        // Apply making charges
        double makingChargePercent = ornament.getMakingChargePercent() != null ? ornament.getMakingChargePercent() : 11.0;
        double finalPrice = basePrice + (basePrice * makingChargePercent / 100);
        ornament.setPrice(finalPrice);


        return toResponse(repo.save(ornament));
    }



    public OrnamentResponse update(Long id, MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
        OrnamentRequest req = parse(dataJson);
        Ornament ornament = repo.findById(id).orElseThrow(() -> new InvalidArgumentException("Not found"));

        updateEntity(ornament, req);

        if (mainImage != null && !mainImage.isEmpty()) {
            ornament.setMainImage(s3Service.uploadFile(mainImage));
        }

        if (subImages != null && !subImages.isEmpty()) {
            assignSubImages(ornament, subImages);
        }

        // Recalculate base price using updated price breakups
        List<PriceBreakup> priceBreakups = null;
        double basePrice = 0.0;

        if (req.getPriceBreakups() != null && !req.getPriceBreakups().isEmpty()) {
            double goldRate = metalRateRepo.findByMetalType("GOLD")
                    .map(MetalRate::getRateInrPerGram)
                    .orElseThrow(() -> new InvalidArgumentException("Gold rate not available"));

            priceBreakups = req.getPriceBreakups().stream()
                    .map(dto -> toPriceBreakupEntity(dto, ornament))
                    .toList();

            ornament.getPriceBreakups().clear();
            ornament.getPriceBreakups().addAll(priceBreakups);

            for (PriceBreakup pb : priceBreakups) {
                if (pb.getWeightG() != null && pb.getWeightG() > 0) {
                    basePrice += pb.getWeightG() * goldRate;
                } else {
                    basePrice += pb.getFinalValue() != null ? pb.getFinalValue() : 0;
                }
            }
        }

        double makingChargePercent = ornament.getMakingChargePercent() != null ? ornament.getMakingChargePercent() : 11.0;
        double finalPrice = basePrice + (basePrice * makingChargePercent / 100);

        ornament.setPrice(finalPrice);

        return toResponse(repo.save(ornament));
    }


    public void delete(Long id) {
        Ornament ornament = repo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found with id: " + id));

        if (ornament.getMainImage() != null) {
            s3Service.deleteFile(ornament.getMainImage());
        }

        if (ornament.getSubImage1() != null) s3Service.deleteFile(ornament.getSubImage1());
        if (ornament.getSubImage2() != null) s3Service.deleteFile(ornament.getSubImage2());
        if (ornament.getSubImage3() != null) s3Service.deleteFile(ornament.getSubImage3());
        if (ornament.getSubImage4() != null) s3Service.deleteFile(ornament.getSubImage4());

        repo.deleteById(id);
    }

    public List<OrnamentResponse> getByItemType(String itemType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repo.findByItemTypeIgnoreCase(itemType, pageable)
                .stream()
                .map(this::toResponse)
                .toList();
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
                .purity(r.getPurity()).quality(r.getQuality()).warranty(r.getWarranty())
                .itemType(r.getItemType()).details(r.getDetails())
                .origin(r.getOrigin() != null ? r.getOrigin() : "INDIAN")
                .makingChargePercent(r.getMakingChargePercent() != null ? r.getMakingChargePercent() : 11.0)
                .build();
    }


    private void updateEntity(Ornament o, OrnamentRequest r) {
        o.setName(r.getName());
        o.setCategory(r.getCategory());
        o.setSubCategory(r.getSubCategory());
        o.setGender(r.getGender());
        o.setDescription1(r.getDescription1());
        o.setDescription2(r.getDescription2());
        o.setDescription3(r.getDescription3());
        o.setDescription(r.getDescription());
        o.setMaterial(r.getMaterial());
        o.setPurity(r.getPurity());
        o.setQuality(r.getQuality());
        o.setWarranty(r.getWarranty());
        o.setItemType(r.getItemType());
        o.setDetails(r.getDetails());
        o.setOrigin(r.getOrigin());
        o.setMakingChargePercent(r.getMakingChargePercent());
        // DO NOT set price here
    }

    private void assignSubImages(Ornament ornament, List<MultipartFile> subImages) {
        if (subImages == null || subImages.isEmpty()) {
            throw new InvalidArgumentException("All 4 subImages (subImage1 to subImage4) are required.");
        }

        for (int i = 0; i < subImages.size(); i++) {
            MultipartFile file = subImages.get(i);
            if (file == null || file.isEmpty()) {
                throw new InvalidArgumentException("subImage" + (i + 1) + " is missing.");
            }
            if (!isValidImage(file)) {
                throw new InvalidArgumentException("subImage" + (i + 1) + " must be a valid image (jpeg/png/webp).");
            }
        }

        if (subImages.size() < 4) {
            throw new InvalidArgumentException("Exactly 4 subImages are required.");
        }

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
                .id(o.getId())
                .name(o.getName())
                .price(o.getPrice())
                .category(o.getCategory())
                .subCategory(o.getSubCategory())
                .gender(o.getGender())
                .description1(o.getDescription1())
                .description2(o.getDescription2())
                .description3(o.getDescription3())
                .description(o.getDescription())
                .mainImage(o.getMainImage())
                .subImages(List.of(
                        o.getSubImage1(),
                        o.getSubImage2(),
                        o.getSubImage3(),
                        o.getSubImage4()
                ).stream().filter(url -> url != null).collect(Collectors.toList()))
                .material(o.getMaterial())
                .purity(o.getPurity())
                .quality(o.getQuality())
                .warranty(o.getWarranty())
                .itemType(o.getItemType())
                .details(o.getDetails())
                .origin(o.getOrigin())
                .makingChargePercent(o.getMakingChargePercent())
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