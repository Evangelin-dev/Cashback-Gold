package com.cashback.gold.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PagedWishlistResponse {
    private List<WishlistItemResponse> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
