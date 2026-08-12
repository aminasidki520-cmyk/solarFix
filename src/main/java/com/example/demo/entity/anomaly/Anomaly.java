package com.example.demo.entity.anomaly;
import com.example.demo.entity.equipement.Equipment;
import com.example.demo.entity.ticket.Ticket;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Anomaly {
    /** the entities **/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  AnomalyId;

    @Enumerated(EnumType.STRING)
    private AnomalyType AnomalyType;
   @Enumerated(EnumType.STRING)
    private Severity severity;

    private  String geometry;

    private Boolean processed;
    private LocalDateTime startAt;
    private LocalDateTime endAt;

    /**
     * Many anomalies can belong to one equipment.
     * Equipment (1) → (N) Anomaly
     */
    @ManyToOne(fetch = FetchType.LAZY)   /**For large systems, LAZY is generally preferred because it avoids unnecessary database queries.**/
    @JoinColumn(name = "equipment_id", nullable = false)/**Every anomaly must belong to an equipment.**/
    @JsonIgnore
    private Equipment equipment;
    /**
     * One anomaly creates one ticket.
     * Anomaly (1) → (1) Ticket
     */
    @OneToOne(mappedBy = "anomaly")

    @JsonIgnore
    private Ticket ticket;



    private String region;



}
