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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class OrnamentService {
//
//    private final OrnamentRepository repo;
//    private final S3Service s3Service;
//    private final ObjectMapper objectMapper;
//    private final MetalRateRepository metalRateRepo;
//
//    public OrnamentResponse getById(Long id) {
//        Ornament ornament = repo.findById(id)
//                .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
//        return toResponse(ornament);
//    }
//
//    public List<OrnamentResponse> getAll(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        return repo.findAll(pageable)
//                .map(this::toResponse)
//                .toList();
//    }
//
//    public OrnamentResponse create(MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
//        OrnamentRequest req = parse(dataJson);
//        Ornament ornament = toEntity(req);
//
//        ornament.setMainImage(s3Service.uploadFile(mainImage));
//        ornament.setSubImages(subImages.stream().map(s3Service::uploadFile).toArray(String[]::new));
//
//        // Ensure gramPrice is set
//        double gramPrice = req.getGramPrice() != null
//                ? req.getGramPrice()
//                : metalRateRepo.findByMetalType("GOLD")
//                .map(MetalRate::getRateInrPerGram)
//                .orElseThrow(() -> new InvalidArgumentException("Gold rate unavailable"));
//
//        ornament.setGramPrice(gramPrice);
//
//        // Calculate finalValue in priceBreakups only if not provided
//        for (PriceBreakupDTO dto : req.getPriceBreakups()) {
//            if (dto.getFinalValue() == null) { // Skip calculation if finalValue is provided
//                Double weight = dto.getNetWeight();
//                if (weight == null) {
//                    throw new InvalidArgumentException("Either netWeight or grossWeight must be provided when finalValue is not set for component: " + dto.getComponent());
//                }
//                double discount = dto.getDiscount() != null ? dto.getDiscount() : 0;
//                double finalValue = (weight * gramPrice) - discount;
//                dto.setFinalValue(finalValue);
//            }
//        }
//
//        double basePrice = req.getPriceBreakups().stream()
//                .mapToDouble(dto -> dto.getFinalValue() != null ? dto.getFinalValue() : 0)
//                .sum();
//
//        double finalPrice = basePrice + (basePrice * ornament.getMakingChargePercent() / 100);
//
//        ornament.setTotalGram(req.getTotalGram());
//        ornament.setTotalPrice(finalPrice);
//
//        List<PriceBreakup> breakups = req.getPriceBreakups().stream()
//                .map(dto -> toPriceBreakupEntity(dto, ornament))
//                .toList();
//        ornament.setPriceBreakups(breakups);
//
//        Ornament saved = repo.save(ornament);
//        return toResponse(saved);
//    }
//
//    public OrnamentResponse update(Long id, MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
//        OrnamentRequest req = parse(dataJson);
//        Ornament ornament = repo.findById(id).orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
//
//        updateEntity(ornament, req);
//
//        if (mainImage != null) {
//            ornament.setMainImage(s3Service.uploadFile(mainImage));
//        }
//        if (subImages != null && !subImages.isEmpty()) {
//            ornament.setSubImages(subImages.stream().map(s3Service::uploadFile).toArray(String[]::new));
//        }
//
//        double basePrice = calculateBasePrice(req.getPriceBreakups(), req.getGramPrice());
//        double finalPrice = basePrice + (basePrice * ornament.getMakingChargePercent() / 100);
//
//        ornament.setTotalGram(req.getTotalGram());
//        ornament.setGramPrice(req.getGramPrice());
//        ornament.setTotalPrice(finalPrice);
//
//        ornament.getPriceBreakups().clear();
//        List<PriceBreakup> breakups = req.getPriceBreakups().stream()
//                .map(dto -> toPriceBreakupEntity(dto, ornament))
//                .toList();
//        ornament.getPriceBreakups().addAll(breakups);
//
//        Ornament updated = repo.save(ornament);
//        return toResponse(updated);
//    }
//
//    public void delete(Long id) {
//        Ornament ornament = repo.findById(id)
//                .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
//        s3Service.deleteFile(ornament.getMainImage());
//        for (String img : ornament.getSubImages()) {
//            s3Service.deleteFile(img);
//        }
//        repo.delete(ornament);
//    }
//
//    private double calculateBasePrice(List<PriceBreakupDTO> breakups, Double providedGramPrice) {
//        double goldRate = providedGramPrice != null
//                ? providedGramPrice
//                : metalRateRepo.findByMetalType("GOLD")
//                .map(MetalRate::getRateInrPerGram)
//                .orElseThrow(() -> new InvalidArgumentException("Gold rate unavailable"));
//
//        return breakups.stream()
//                .mapToDouble(pb -> {
//                    if (pb.getFinalValue() != null) {
//                        return pb.getFinalValue(); // Use provided finalValue (e.g., for diamonds)
//                    }
//                    Double weight = pb.getNetWeight() != null ? pb.getNetWeight() : pb.getGrossWeight();
//                    if (weight == null) {
//                        throw new InvalidArgumentException("Either netWeight or grossWeight must be provided when finalValue is not set for component: " + pb.getComponent());
//                    }
//                    double discount = pb.getDiscount() != null ? pb.getDiscount() : 0;
//                    return (weight * goldRate) - discount;
//                })
//                .sum();
//    }
//
//    private OrnamentRequest parse(String json) {
//        try {
//            return objectMapper.readValue(json, OrnamentRequest.class);
//        } catch (Exception e) {
//            throw new InvalidArgumentException("Invalid JSON: " + e.getMessage());
//        }
//    }
//
//    private Ornament toEntity(OrnamentRequest r) {
//        return Ornament.builder()
//                .name(r.getName()).category(r.getCategory()).subCategory(r.getSubCategory()).gender(r.getGender())
//                .description(r.getDescription()).description1(r.getDescription1()).description2(r.getDescription2()).description3(r.getDescription3())
//                .material(r.getMaterial()).purity(r.getPurity()).quality(r.getQuality()).warranty(r.getWarranty()).itemType(r.getItemType())
//                .details(r.getDetails()).origin(r.getOrigin()).makingChargePercent(r.getMakingChargePercent())
//                .build();
//    }
//
//    private void updateEntity(Ornament o, OrnamentRequest r) {
//        o.setName(r.getName());
//        o.setCategory(r.getCategory());
//        o.setSubCategory(r.getSubCategory());
//        o.setGender(r.getGender());
//        o.setItemType(r.getItemType());
//        o.setDescription(r.getDescription());
//        o.setDescription1(r.getDescription1());
//        o.setDescription2(r.getDescription2());
//        o.setDescription3(r.getDescription3());
//        o.setMaterial(r.getMaterial());
//        o.setPurity(r.getPurity());
//        o.setQuality(r.getQuality());
//        o.setWarranty(r.getWarranty());
//        o.setDetails(r.getDetails());
//        o.setOrigin(r.getOrigin());
//        o.setMakingChargePercent(r.getMakingChargePercent());
//    }
//
//    private OrnamentResponse toResponse(Ornament o) {
//        return OrnamentResponse.builder()
//                .id(o.getId()).name(o.getName()).totalGram(o.getTotalGram()).gramPrice(o.getGramPrice()).totalPrice(o.getTotalPrice())
//                .category(o.getCategory()).subCategory(o.getSubCategory()).gender(o.getGender()).itemType(o.getItemType())
//                .description(o.getDescription()).description1(o.getDescription1()).description2(o.getDescription2()).description3(o.getDescription3())
//                .material(o.getMaterial()).purity(o.getPurity()).quality(o.getQuality()).warranty(o.getWarranty())
//                .details(o.getDetails()).origin(o.getOrigin()).makingChargePercent(o.getMakingChargePercent())
//                .mainImage(o.getMainImage()).subImages(List.of(o.getSubImages()))
//                .priceBreakups(o.getPriceBreakups().stream().map(this::toPriceBreakupDTO).toList())
//                .build();
//    }
//
//    private PriceBreakup toPriceBreakupEntity(PriceBreakupDTO dto, Ornament ornament) {
//        return PriceBreakup.builder()
//                .ornament(ornament).component(dto.getComponent())
//                .netWeight(dto.getNetWeight()).grossWeight(dto.getGrossWeight())
//                .discount(dto.getDiscount()).finalValue(dto.getFinalValue())
//                .build();
//    }
//
//    private PriceBreakupDTO toPriceBreakupDTO(PriceBreakup pb) {
//        return PriceBreakupDTO.builder()
//                .id(pb.getId()).component(pb.getComponent())
//                .netWeight(pb.getNetWeight()).grossWeight(pb.getGrossWeight())
//                .discount(pb.getDiscount()).finalValue(pb.getFinalValue())
//                .build();
//    }
//
//    public List<OrnamentResponse> getByItemType(String itemType, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
//        return repo.findByItemTypeIgnoreCase(itemType, pageable)
//                .stream()
//                .map(this::toResponse)
//                .toList();
//    }
//}


import com.cashback.gold.entity.Ornament;
import com.cashback.gold.entity.PriceBreakup;
import com.cashback.gold.repository.OrnamentRepository;
import com.cashback.gold.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrnamentService {

    private final OrnamentRepository ornamentRepository;
    private final PriceBreakupRepository priceBreakupRepository;
    private final S3Service s3Service;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrnamentResponse create(MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
        try {
            OrnamentRequest req = objectMapper.readValue(dataJson, OrnamentRequest.class);

            // Upload main and sub images
            String mainImageUrl = s3Service.uploadFile(mainImage);
            List<String> subImageUrls = (subImages != null) ?
                    subImages.stream().map(s3Service::uploadFile).toList() : List.of();

            // Compute total value and weight from priceBreakups
            BigDecimal sumValue = BigDecimal.ZERO;
            BigDecimal totalWeight = BigDecimal.ZERO;

            for (PriceBreakupDTO dto : req.getPriceBreakups()) {
                sumValue = sumValue.add(dto.getValue());
                totalWeight = totalWeight.add(dto.getNetWeight());
            }

            // Calculate making charges
            BigDecimal makingCharge = sumValue.multiply(req.getMakingChargePercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            // Final price calculations
            BigDecimal totalPrice = sumValue.add(makingCharge);
            BigDecimal discount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;
            BigDecimal totalPriceAfterDiscount = totalPrice.subtract(discount);

            // Create and save Ornament entity
            Ornament ornament = Ornament.builder()
                    .name(req.getName())
                    .goldPerGramPrice(req.getGoldPerGramPrice())
                    .category(req.getCategory())
                    .subCategory(req.getSubCategory())
                    .itemType(req.getItemType())
                    .details(req.getDetails())
                    .description(req.getDescription())
                    .description1(req.getDescription1())
                    .description2(req.getDescription2())
                    .description3(req.getDescription3())
                    .material(req.getMaterial())
                    .purity(req.getPurity())
                    .quality(req.getQuality())
                    .warranty(req.getWarranty())
                    .origin(req.getOrigin())
                    .makingChargePercent(req.getMakingChargePercent())
                    .grossWeight(totalWeight)
                    .discount(discount)
                    .totalPrice(totalPrice)
                    .totalPriceAfterDiscount(totalPriceAfterDiscount)
                    .mainImage(mainImageUrl)
                    .subImages(subImageUrls)
                    .build();

            ornament = ornamentRepository.save(ornament);

            // Save price breakup list
            for (PriceBreakupDTO dto : req.getPriceBreakups()) {
                PriceBreakup pb = new PriceBreakup();
                pb.setOrnament(ornament); // ✅ CORRECT way to set relation
                pb.setComponent(dto.getComponent());
                pb.setNetWeight(dto.getNetWeight());
                pb.setValue(dto.getValue());
                priceBreakupRepository.save(pb);
            }


            return OrnamentResponse.builder()
                    .id(ornament.getId())
                    .name(ornament.getName())
                    .goldPerGramPrice(ornament.getGoldPerGramPrice())
                    .category(ornament.getCategory())
                    .subCategory(ornament.getSubCategory())
                    .itemType(ornament.getItemType())
                    .details(ornament.getDetails())
                    .description(ornament.getDescription())
                    .description1(ornament.getDescription1())
                    .description2(ornament.getDescription2())
                    .description3(ornament.getDescription3())
                    .material(ornament.getMaterial())
                    .purity(ornament.getPurity())
                    .quality(ornament.getQuality())
                    .warranty(ornament.getWarranty())
                    .origin(ornament.getOrigin())
                    .makingChargePercent(ornament.getMakingChargePercent())
                    .grossWeight(ornament.getGrossWeight())
                    .discount(ornament.getDiscount())
                    .totalPrice(ornament.getTotalPrice())
                    .totalPriceAfterDiscount(totalPriceAfterDiscount)
                    .mainImage(ornament.getMainImage())
                    .subImages(ornament.getSubImages())
                    .priceBreakups(req.getPriceBreakups())
                    .build();

        } catch (Exception e) {
//            log.error("❌ Error while creating ornament", e);
            throw new RuntimeException("Failed to create ornament", e);
        }
    }

    public List<OrnamentResponse> getAllOrnaments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ornamentRepository.findAll(pageable)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrnamentResponse getOrnamentById(Long id) {
        return ornamentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Ornament not found"));
    }

    public void deleteOrnament(Long id) {

                Ornament ornament = ornamentRepository.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
        s3Service.deleteFile(ornament.getMainImage());
        for (String img : ornament.getSubImages()) {
            s3Service.deleteFile(img);
        }
        ornamentRepository.deleteById(id);
    }


    private OrnamentResponse mapToResponse(Ornament ornament) {
        BigDecimal discount = ornament.getDiscount() != null ? ornament.getDiscount() : BigDecimal.ZERO;
        BigDecimal totalPrice = ornament.getTotalPrice() != null ? ornament.getTotalPrice() : BigDecimal.ZERO;

        return OrnamentResponse.builder()
                .id(ornament.getId())
                .name(ornament.getName())
                .goldPerGramPrice(ornament.getGoldPerGramPrice())
                .category(ornament.getCategory())
                .subCategory(ornament.getSubCategory())
                .itemType(ornament.getItemType())
                .details(ornament.getDetails())
                .description(ornament.getDescription())
                .description1(ornament.getDescription1())
                .description2(ornament.getDescription2())
                .description3(ornament.getDescription3())
                .material(ornament.getMaterial())
                .purity(ornament.getPurity())
                .quality(ornament.getQuality())
                .warranty(ornament.getWarranty())
                .origin(ornament.getOrigin())
                .makingChargePercent(ornament.getMakingChargePercent())
                .grossWeight(ornament.getGrossWeight())
                .discount(discount)
                .totalPrice(totalPrice)
                .totalPriceAfterDiscount(totalPrice.subtract(discount))
                .mainImage(ornament.getMainImage())
                .subImages(ornament.getSubImages())
                .priceBreakups(
                        ornament.getPriceBreakups().stream()
                                .map(pb -> {
                                    PriceBreakupDTO dto = new PriceBreakupDTO();
                                    dto.setComponent(pb.getComponent());
                                    dto.setNetWeight(pb.getNetWeight());
                                    dto.setValue(pb.getValue());
                                    return dto;
                                })
                                .collect(Collectors.toList())
                )
                .build();
    }

    @Transactional
    public OrnamentResponse update(Long id, String dataJson, MultipartFile mainImage, List<MultipartFile> subImages) {
        try {
            OrnamentRequest req = objectMapper.readValue(dataJson, OrnamentRequest.class);
            Ornament ornament = ornamentRepository.findById(id)
                    .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));

            // ✅ Update all basic fields
            ornament.setName(req.getName());
            ornament.setGoldPerGramPrice(req.getGoldPerGramPrice());
            ornament.setCategory(req.getCategory());
            ornament.setSubCategory(req.getSubCategory());
            ornament.setItemType(req.getItemType());
            ornament.setDetails(req.getDetails());
            ornament.setDescription(req.getDescription());
            ornament.setDescription1(req.getDescription1());
            ornament.setDescription2(req.getDescription2());
            ornament.setDescription3(req.getDescription3());
            ornament.setMaterial(req.getMaterial());
            ornament.setPurity(req.getPurity());
            ornament.setQuality(req.getQuality());
            ornament.setWarranty(req.getWarranty());
            ornament.setOrigin(req.getOrigin());
            ornament.setMakingChargePercent(req.getMakingChargePercent());
            ornament.setDiscount(req.getDiscount());

            // ✅ Delete old price breakups
            priceBreakupRepository.deleteByOrnamentId(ornament.getId());

            // ✅ Add new price breakups and compute totals
            BigDecimal totalValue = BigDecimal.ZERO;
            BigDecimal grossWeight = BigDecimal.ZERO;

            for (PriceBreakupDTO dto : req.getPriceBreakups()) {
                PriceBreakup pb = new PriceBreakup();
                pb.setOrnament(ornament);
                pb.setComponent(dto.getComponent());
                pb.setNetWeight(dto.getNetWeight());
                pb.setValue(dto.getValue());
                priceBreakupRepository.save(pb);

                totalValue = totalValue.add(dto.getValue());
                grossWeight = grossWeight.add(dto.getNetWeight());
            }

            // ✅ Calculate final prices
            BigDecimal makingCharge = totalValue.multiply(req.getMakingChargePercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal totalPrice = totalValue.add(makingCharge);
            BigDecimal discount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;
            BigDecimal totalPriceAfterDiscount = totalPrice.subtract(discount);

            ornament.setGrossWeight(grossWeight);
            ornament.setTotalPrice(totalPrice);
            ornament.setTotalPriceAfterDiscount(totalPriceAfterDiscount);

            // ✅ Replace images if new ones are uploaded
            if (mainImage != null && !mainImage.isEmpty()) {
                ornament.setMainImage(s3Service.uploadFile(mainImage));
            }

            if (subImages != null && !subImages.isEmpty()) {
                List<String> newSubImages = subImages.stream()
                        .map(s3Service::uploadFile)
                        .collect(Collectors.toList());
                ornament.setSubImages(newSubImages);
            }

            ornament.setUpdatedAt(LocalDateTime.now());
            ornamentRepository.save(ornament);

            return mapToResponse(ornament);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update ornament", e);
        }
    }


}
