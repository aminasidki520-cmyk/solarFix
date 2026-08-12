package com.example.demo.entity.equipement;

import com.example.demo.entity.anomaly.Anomaly;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipments")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long equipment_id;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Column(nullable = false)
    private String manufacturer;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private LocalDate installationDate;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate warrantyExpiryDate;

    @Column(length = 1000)
    private String description;
/**Equipment (1) → (N) Anomaly**/
    @OneToMany(mappedBy = "equipment",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Anomaly> anomalies = new ArrayList<>();
}