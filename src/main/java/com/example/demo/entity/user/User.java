package com.example.demo.entity.user;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.demo.entity.ticket.TicketUpdate;
import com.example.demo.entity.report.Report;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "app_user")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Role role;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String regionOfResponsibility;
/**User (1) → (N) Report**/
    @JsonIgnore
    @OneToMany(mappedBy = "author",
            cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

    /**ticket update **/
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy")
    private List<TicketUpdate> ticketUpdates = new ArrayList<>();






}

