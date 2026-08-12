package com.example.demo.entity.user;
import com.example.demo.entity.ticket.Ticket;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.entity.ticket.TicketUpdate;

import com.example.demo.entity.anomaly.Anomaly;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "technicians")
public class Technician extends User{
    /** the entities **/
    private Boolean availability;
    public Long numberOfTicketAssigned;




    @ElementCollection
    @CollectionTable(name = "technician_skills", joinColumns = @JoinColumn(name = "technician_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();


    // helpers methods
    // ===== HELPER METHODS =====

    // Add a skill
    public void addSkill(String skill) {
        if (this.skills == null) {
            this.skills = new ArrayList<>();
        }
        this.skills.add(skill);
    }

    // Remove a skill
    public void removeSkill(String skill) {
        if (this.skills != null) {
            this.skills.remove(skill);
        }
    }

    // Check if technician is available
    public boolean isAvailable() {
        return Boolean.TRUE.equals(availability);
    }

    // Mark as available
    public void markAvailable() {
        this.availability = true;
    }

    // Mark as unavailable (busy)
    public void markUnavailable() {
        this.availability = false;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "technician")
    private List<TicketAssignment> assignments = new ArrayList<>();


}
