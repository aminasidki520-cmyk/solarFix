package com.example.demo.entity.ticket;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.user.Technician;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;
/**Administrator–Technician–Ticket → TicketAssignment**/
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrator_id", nullable = false)
    private Administrator administrator;

    @Column(nullable = false)
    private LocalDateTime assignedAt;

    private LocalDateTime approvedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status;

    @Column(length = 1000)
    private String comment;
}