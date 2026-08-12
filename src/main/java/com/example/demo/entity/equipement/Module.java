package com.example.demo.entity.equipement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "modules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Module extends Equipment {

    @Column(nullable = false)
    private Double ratedPower;

    @Column(nullable = false)
    private Double voltage;

    @Column(nullable = false)
    private Double current;

    private Double efficiency;

    private Double length;

    private Double width;

    private Double weight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModuleTechnology moduleTechnology;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModuleStatus moduleStatus;
}