package com.cashback.gold.entity;

import com.cashback.gold.enums.FlyerType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "flyers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @Enumerated(EnumType.STRING)
    private FlyerType type;

    private LocalDateTime uploadDate;
}

