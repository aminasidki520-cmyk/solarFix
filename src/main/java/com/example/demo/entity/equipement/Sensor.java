package com.example.demo.entity.equipement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "sensors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sensor extends Equipment {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensorType sensorType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensorStatus sensorStatus;

    @Column(nullable = false)
    private Double currentValue;

    @Column(nullable = false)
    private String unit;
}