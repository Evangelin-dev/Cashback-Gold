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
import com.cashback.gold.service.aws.S3Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrnamentService {

    private final OrnamentRepository repo;
    private final S3Service s3Service;
    private final ObjectMapper objectMapper;
    private final MetalRateRepository metalRateRepo;

    public OrnamentResponse getById(Long id) {
        Ornament ornament = repo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
        return toResponse(ornament);
    }

    public List<OrnamentResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return repo.findAll(pageable)
                .map(this::toResponse)
                .toList();
    }

    public OrnamentResponse create(MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
        OrnamentRequest req = parse(dataJson);
        Ornament ornament = toEntity(req);

        ornament.setMainImage(s3Service.uploadFile(mainImage));
        ornament.setSubImages(subImages.stream().map(s3Service::uploadFile).toArray(String[]::new));

        // Ensure gramPrice is set
        double gramPrice = req.getGramPrice() != null
                ? req.getGramPrice()
                : metalRateRepo.findByMetalType("GOLD")
                .map(MetalRate::getRateInrPerGram)
                .orElseThrow(() -> new InvalidArgumentException("Gold rate unavailable"));

        ornament.setGramPrice(gramPrice);

        // Calculate finalValue in priceBreakups only if not provided
        for (PriceBreakupDTO dto : req.getPriceBreakups()) {
            if (dto.getFinalValue() == null) { // Skip calculation if finalValue is provided
                Double weight = dto.getNetWeight();
                if (weight == null) {
                    throw new InvalidArgumentException("Either netWeight or grossWeight must be provided when finalValue is not set for component: " + dto.getComponent());
                }
                double discount = dto.getDiscount() != null ? dto.getDiscount() : 0;
                double finalValue = (weight * gramPrice) - discount;
                dto.setFinalValue(finalValue);
            }
        }

        double basePrice = req.getPriceBreakups().stream()
                .mapToDouble(dto -> dto.getFinalValue() != null ? dto.getFinalValue() : 0)
                .sum();

        double finalPrice = basePrice + (basePrice * ornament.getMakingChargePercent() / 100);

        ornament.setTotalGram(req.getTotalGram());
        ornament.setTotalPrice(finalPrice);

        List<PriceBreakup> breakups = req.getPriceBreakups().stream()
                .map(dto -> toPriceBreakupEntity(dto, ornament))
                .toList();
        ornament.setPriceBreakups(breakups);

        Ornament saved = repo.save(ornament);
        return toResponse(saved);
    }

    public OrnamentResponse update(Long id, MultipartFile mainImage, List<MultipartFile> subImages, String dataJson) {
        OrnamentRequest req = parse(dataJson);
        Ornament ornament = repo.findById(id).orElseThrow(() -> new InvalidArgumentException("Ornament not found"));

        updateEntity(ornament, req);

        if (mainImage != null) {
            ornament.setMainImage(s3Service.uploadFile(mainImage));
        }
        if (subImages != null && !subImages.isEmpty()) {
            ornament.setSubImages(subImages.stream().map(s3Service::uploadFile).toArray(String[]::new));
        }

        double basePrice = calculateBasePrice(req.getPriceBreakups(), req.getGramPrice());
        double finalPrice = basePrice + (basePrice * ornament.getMakingChargePercent() / 100);

        ornament.setTotalGram(req.getTotalGram());
        ornament.setGramPrice(req.getGramPrice());
        ornament.setTotalPrice(finalPrice);

        ornament.getPriceBreakups().clear();
        List<PriceBreakup> breakups = req.getPriceBreakups().stream()
                .map(dto -> toPriceBreakupEntity(dto, ornament))
                .toList();
        ornament.getPriceBreakups().addAll(breakups);

        Ornament updated = repo.save(ornament);
        return toResponse(updated);
    }

    public void delete(Long id) {
        Ornament ornament = repo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
        s3Service.deleteFile(ornament.getMainImage());
        for (String img : ornament.getSubImages()) {
            s3Service.deleteFile(img);
        }
        repo.delete(ornament);
    }

    private double calculateBasePrice(List<PriceBreakupDTO> breakups, Double providedGramPrice) {
        double goldRate = providedGramPrice != null
                ? providedGramPrice
                : metalRateRepo.findByMetalType("GOLD")
                .map(MetalRate::getRateInrPerGram)
                .orElseThrow(() -> new InvalidArgumentException("Gold rate unavailable"));

        return breakups.stream()
                .mapToDouble(pb -> {
                    if (pb.getFinalValue() != null) {
                        return pb.getFinalValue(); // Use provided finalValue (e.g., for diamonds)
                    }
                    Double weight = pb.getNetWeight() != null ? pb.getNetWeight() : pb.getGrossWeight();
                    if (weight == null) {
                        throw new InvalidArgumentException("Either netWeight or grossWeight must be provided when finalValue is not set for component: " + pb.getComponent());
                    }
                    double discount = pb.getDiscount() != null ? pb.getDiscount() : 0;
                    return (weight * goldRate) - discount;
                })
                .sum();
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
                .name(r.getName()).category(r.getCategory()).subCategory(r.getSubCategory()).gender(r.getGender())
                .description(r.getDescription()).description1(r.getDescription1()).description2(r.getDescription2()).description3(r.getDescription3())
                .material(r.getMaterial()).purity(r.getPurity()).quality(r.getQuality()).warranty(r.getWarranty()).itemType(r.getItemType())
                .details(r.getDetails()).origin(r.getOrigin()).makingChargePercent(r.getMakingChargePercent())
                .build();
    }

    private void updateEntity(Ornament o, OrnamentRequest r) {
        o.setName(r.getName());
        o.setCategory(r.getCategory());
        o.setSubCategory(r.getSubCategory());
        o.setGender(r.getGender());
        o.setItemType(r.getItemType());
        o.setDescription(r.getDescription());
        o.setDescription1(r.getDescription1());
        o.setDescription2(r.getDescription2());
        o.setDescription3(r.getDescription3());
        o.setMaterial(r.getMaterial());
        o.setPurity(r.getPurity());
        o.setQuality(r.getQuality());
        o.setWarranty(r.getWarranty());
        o.setDetails(r.getDetails());
        o.setOrigin(r.getOrigin());
        o.setMakingChargePercent(r.getMakingChargePercent());
    }

    private OrnamentResponse toResponse(Ornament o) {
        return OrnamentResponse.builder()
                .id(o.getId()).name(o.getName()).totalGram(o.getTotalGram()).gramPrice(o.getGramPrice()).totalPrice(o.getTotalPrice())
                .category(o.getCategory()).subCategory(o.getSubCategory()).gender(o.getGender()).itemType(o.getItemType())
                .description(o.getDescription()).description1(o.getDescription1()).description2(o.getDescription2()).description3(o.getDescription3())
                .material(o.getMaterial()).purity(o.getPurity()).quality(o.getQuality()).warranty(o.getWarranty())
                .details(o.getDetails()).origin(o.getOrigin()).makingChargePercent(o.getMakingChargePercent())
                .mainImage(o.getMainImage()).subImages(List.of(o.getSubImages()))
                .priceBreakups(o.getPriceBreakups().stream().map(this::toPriceBreakupDTO).toList())
                .build();
    }

    private PriceBreakup toPriceBreakupEntity(PriceBreakupDTO dto, Ornament ornament) {
        return PriceBreakup.builder()
                .ornament(ornament).component(dto.getComponent())
                .netWeight(dto.getNetWeight()).grossWeight(dto.getGrossWeight())
                .discount(dto.getDiscount()).finalValue(dto.getFinalValue())
                .build();
    }

    private PriceBreakupDTO toPriceBreakupDTO(PriceBreakup pb) {
        return PriceBreakupDTO.builder()
                .id(pb.getId()).component(pb.getComponent())
                .netWeight(pb.getNetWeight()).grossWeight(pb.getGrossWeight())
                .discount(pb.getDiscount()).finalValue(pb.getFinalValue())
                .build();
    }

    public List<OrnamentResponse> getByItemType(String itemType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repo.findByItemTypeIgnoreCase(itemType, pageable)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}