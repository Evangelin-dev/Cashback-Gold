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
import java.math.BigDecimal;
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
            List<String> subImageUrls = (subImages != null) ? subImages.stream().map(s3Service::uploadFile).toList() : List.of();

            // Compute total value and weight from priceBreakups
            BigDecimal sumValue = BigDecimal.ZERO;
            BigDecimal totalWeight = BigDecimal.ZERO;

            for (PriceBreakupDTO dto : req.getPriceBreakups()) {
                sumValue = sumValue.add(dto.getValue());
                totalWeight = totalWeight.add(dto.getNetWeight());
            }

            // Calculate making charges
            BigDecimal makingCharge = sumValue.multiply(req.getMakingChargePercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            // Final price calculations
            BigDecimal totalPrice = sumValue.add(makingCharge);
            BigDecimal discount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;
            Double totalPriceAfterDiscount = totalPrice.subtract(discount).doubleValue();

            // Create and save Ornament entity
            Ornament ornament = Ornament.builder().name(req.getName()).goldPerGramPrice(req.getGoldPerGramPrice()).category(req.getCategory()).subCategory(req.getSubCategory()).itemType(req.getItemType()).details(req.getDetails()).description(req.getDescription()).description1(req.getDescription1()).description2(req.getDescription2()).description3(req.getDescription3()).material(req.getMaterial()).purity(req.getPurity()).quality(req.getQuality()).warranty(req.getWarranty()).origin(req.getOrigin()).makingChargePercent(req.getMakingChargePercent()).grossWeight(totalWeight).discount(discount).totalPrice(totalPrice).totalPriceAfterDiscount(totalPriceAfterDiscount).mainImage(mainImageUrl).subImages(subImageUrls).build();

            ornament = ornamentRepository.save(ornament);

            // Save price breakup list
            for (PriceBreakupDTO dto : req.getPriceBreakups()) {
                PriceBreakup pb = new PriceBreakup();
                pb.setOrnament(ornament);
                pb.setComponent(dto.getComponent());
                pb.setNetWeight(dto.getNetWeight());
                pb.setValue(dto.getValue());
                priceBreakupRepository.save(pb);
            }


            return OrnamentResponse.builder().id(ornament.getId()).name(ornament.getName()).goldPerGramPrice(ornament.getGoldPerGramPrice()).category(ornament.getCategory()).subCategory(ornament.getSubCategory()).itemType(ornament.getItemType()).details(ornament.getDetails()).description(ornament.getDescription()).description1(ornament.getDescription1()).description2(ornament.getDescription2()).description3(ornament.getDescription3()).material(ornament.getMaterial()).purity(ornament.getPurity()).quality(ornament.getQuality()).warranty(ornament.getWarranty()).origin(ornament.getOrigin()).makingChargePercent(ornament.getMakingChargePercent()).grossWeight(ornament.getGrossWeight()).discount(ornament.getDiscount()).totalPrice(ornament.getTotalPrice()).totalPriceAfterDiscount(totalPriceAfterDiscount).mainImage(ornament.getMainImage()).subImages(ornament.getSubImages()).priceBreakups(req.getPriceBreakups()).build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create ornament", e);
        }
    }

    public List<OrnamentResponse> getAllOrnaments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ornamentRepository.findAll(pageable).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public OrnamentResponse getOrnamentById(Long id) {
        return ornamentRepository.findById(id).map(this::mapToResponse).orElseThrow(() -> new RuntimeException("Ornament not found"));
    }

    public void deleteOrnament(Long id) {

        Ornament ornament = ornamentRepository.findById(id).orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
        s3Service.deleteFile(ornament.getMainImage());
        for (String img : ornament.getSubImages()) {
            s3Service.deleteFile(img);
        }
        ornamentRepository.deleteById(id);
    }


    private OrnamentResponse mapToResponse(Ornament ornament) {
        BigDecimal discount = ornament.getDiscount() != null ? ornament.getDiscount() : BigDecimal.ZERO;
        BigDecimal totalPrice = ornament.getTotalPrice() != null ? ornament.getTotalPrice() : BigDecimal.ZERO;

        return OrnamentResponse.builder().id(ornament.getId()).name(ornament.getName()).goldPerGramPrice(ornament.getGoldPerGramPrice()).category(ornament.getCategory()).subCategory(ornament.getSubCategory()).itemType(ornament.getItemType()).details(ornament.getDetails()).description(ornament.getDescription()).description1(ornament.getDescription1()).description2(ornament.getDescription2()).description3(ornament.getDescription3()).material(ornament.getMaterial()).purity(ornament.getPurity()).quality(ornament.getQuality()).warranty(ornament.getWarranty()).origin(ornament.getOrigin()).makingChargePercent(ornament.getMakingChargePercent()).grossWeight(ornament.getGrossWeight()).discount(discount).totalPrice(totalPrice).totalPriceAfterDiscount(totalPrice.subtract(discount).doubleValue()).mainImage(ornament.getMainImage()).subImages(ornament.getSubImages()).priceBreakups(ornament.getPriceBreakups().stream().map(pb -> {
            PriceBreakupDTO dto = new PriceBreakupDTO();
            dto.setComponent(pb.getComponent());
            dto.setNetWeight(pb.getNetWeight());
            dto.setValue(pb.getValue());
            return dto;
        }).collect(Collectors.toList())).build();
    }

    @Transactional
    public OrnamentResponse update(Long id, String dataJson, MultipartFile mainImage, List<MultipartFile> subImages) {
        try {
            OrnamentRequest req = objectMapper.readValue(dataJson, OrnamentRequest.class);
            Ornament ornament = ornamentRepository.findById(id).orElseThrow(() -> new InvalidArgumentException("Ornament not found"));

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
            BigDecimal makingCharge = totalValue.multiply(req.getMakingChargePercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal totalPrice = totalValue.add(makingCharge);
            BigDecimal discount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;
            Double totalPriceAfterDiscount = totalPrice.subtract(discount).doubleValue();

            ornament.setGrossWeight(grossWeight);
            ornament.setTotalPrice(totalPrice);
            ornament.setTotalPriceAfterDiscount(totalPriceAfterDiscount);

            // ✅ Replace images if new ones are uploaded
            if (mainImage != null && !mainImage.isEmpty()) {
                ornament.setMainImage(s3Service.uploadFile(mainImage));
            }

            if (subImages != null && !subImages.isEmpty()) {
                List<String> newSubImages = subImages.stream().map(s3Service::uploadFile).collect(Collectors.toList());
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
