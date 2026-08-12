package com.example.demo.repository.ticket;

import com.example.demo.entity.ticket.AssignmentStatus;
import com.example.demo.entity.ticket.TicketAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface TicketAssignmentRepository extends JpaRepository<TicketAssignment, Long> {

    // ─────────────────────────────────────────────────────────────────────
    // 1. Find all assignments for a specific ticket (ordered by date)
    //    Used for: Admin panel's "assignment history"
    // ─────────────────────────────────────────────────────────────────────
    List<TicketAssignment> findByTicket_TicketIdOrderByAssignedAtDesc(Long ticketId);

    // ─────────────────────────────────────────────────────────────────────
    // 2. Find all assignments for a specific technician with a given status
    //    Used for: "Get all approved tickets for technician X"
    // ─────────────────────────────────────────────────────────────────────
    List<TicketAssignment> findByTechnician_IdAndStatus(Long technicianId, AssignmentStatus status);

    // ─────────────────────────────────────────────────────────────────────
    // 3. Find a specific assignment by ticket + technician + status
    //    Used for: "Verify that this ticket is actually assigned to this tech"
    // ─────────────────────────────────────────────────────────────────────
    Optional<TicketAssignment> findByTicket_TicketIdAndTechnician_IdAndStatus(
            Long ticketId,
            Long technicianId,
            AssignmentStatus status
    );

    // ─────────────────────────────────────────────────────────────────────
    // 4. Convenience: Find all APPROVED assignments for a technician
    //    Used for: "Get all tickets the technician is actively working on"
    // ─────────────────────────────────────────────────────────────────────
    default List<TicketAssignment> findApprovedByTechnicianId(Long technicianId) {
        return findByTechnician_IdAndStatus(technicianId, AssignmentStatus.APPROVED);
    }

    // ─────────────────────────────────────────────────────────────────────
    // 5. Check if a technician is already assigned to a ticket
    //    Used for: Prevent duplicate assignments
    // ─────────────────────────────────────────────────────────────────────
    boolean existsByTicket_TicketIdAndTechnician_Id(Long ticketId, Long technicianId);

    // ─────────────────────────────────────────────────────────────────────
    // 6. Find all assignments with a specific status (global)
    //    Used for: Admin dashboard - "Show all pending assignments"
    // ─────────────────────────────────────────────────────────────────────
    List<TicketAssignment> findByStatus(AssignmentStatus status);

}