package com.example.demo.entity.equipement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "inverters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inverter extends Equipment {


    @Column(nullable = false)
    private Double ratedPower;

    @Column(nullable = false)
    private Double inputVoltage;

    @Column(nullable = false)
    private Double outputVoltage;

    @Column(nullable = false)
    private Double efficiency;

    @Column(nullable = false)
    private Integer numberOfMppt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InverterType inverterType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InverterStatus inverterStatus;

    @Column(nullable = false)
    private String firmwareVersion;
}