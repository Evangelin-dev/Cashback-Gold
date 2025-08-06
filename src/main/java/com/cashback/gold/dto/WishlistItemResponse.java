package com.cashback.gold.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WishlistItemResponse {
    private Long ornamentId;
    private String name;
    private String mainImage;
    private String category;
    private String itemType;
    private String purity;
    private Double totalPrice; // if you store computed total, else null
}
