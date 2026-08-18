package com.example.demo.entity.ticket;
import lombok.ToString;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.report.Report;
import com.example.demo.entity.user.Technician;
import com.example.demo.entity.ticket.TicketAssignment;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    /** the entities**/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  ticketId;
    private String title;

    @Column(length = 2000)
    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;
    /**Anomaly (1) → (1) Ticket**/
    @OneToOne
    @ToString.Exclude
    @JoinColumn(
            name = "anomaly_id",
            nullable = false,
            unique = true
    )
    private Anomaly anomaly;
    @ManyToOne
    @JoinColumn(name = "administrator_id")
    @ToString.Exclude
    private Administrator administrator;
/**Administrator–Technician–Ticket → TicketAssignment**/
    @OneToMany(mappedBy = "ticket",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @ToString.Exclude
    private List<TicketAssignment> assignments = new ArrayList<>();


    /**Ticket (1) → (N) TicketUpdate**/
    @JsonIgnore
    @OneToMany(mappedBy = "ticket",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<TicketUpdate> updates = new ArrayList<>();
/**Ticket (1) → (N) Report**/
@JsonIgnore
    @OneToMany(mappedBy = "ticket",
            cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();


}
