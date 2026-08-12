package com.example.demo.entity.user;

import com.example.demo.entity.report.Report;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.demo.entity.ticket.TicketAssignment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "administrators")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Administrator extends User {

    @Column(nullable = false, unique = true)
    private String employeeNumber;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String position;

    /**
     * Assignments approved by this administrator.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "administrator",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<TicketAssignment> assignments = new ArrayList<>();

    /**
     * Reports created by this administrator.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "administrator",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Report> reports = new ArrayList<>();
}