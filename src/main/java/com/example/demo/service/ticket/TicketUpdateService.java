package com.example.demo.service.ticket;

import com.example.demo.entity.ticket.*;
import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.user.Technician;
import com.example.demo.repository.ticket.TicketAssignmentRepository;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.repository.ticket.TicketUpdateRepository;
import com.example.demo.repository.user.AdministratorRepository;
import com.example.demo.service.User.TechnicianService;
import com.example.demo.service.notification.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
public class TicketUpdateService {

    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private TechnicianService technicianService;
    @Autowired
    private AdministratorRepository administratorRepository;
    @Autowired
    private TicketAssignmentRepository ticketAssignmentRepository;
    @Autowired
    private NotificationService notificationService;

    // NOTE: added — you had TicketUpdateRepository declared as an empty class,
    // I turned it into a proper Spring Data interface below and wired it here.
    @Autowired
    private TicketUpdateRepository ticketUpdateRepository;

    /**
     * Changes only the priority. TicketUpdate always logs a status pair
     * (previousStatus/newStatus is NOT NULL in the entity), so for a
     * priority-only change we log the status as unchanged and put the
     * actual change in updateDescription.
     */
    @Transactional
    public TicketUpdate changePriority(Long ticketId,
                                       TicketPriority newPriority,
                                       Administrator administrator) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + ticketId));

        TicketPriority previousPriority = ticket.getPriority();
        ticket.setPriority(newPriority);
        ticketRepository.save(ticket);

        TicketUpdate update = buildUpdate(
                ticket,
                administrator,
                ticket.getStatus(),
                ticket.getStatus(),
                String.format("Priority changed from %s to %s", previousPriority, newPriority)
        );
        TicketUpdate saved = ticketUpdateRepository.save(update);

        // ASSUMPTION: adjust to your actual NotificationService signature.


        return saved;
    }

    @Transactional
    public TicketUpdate changeStatus(Long ticketId,
                                     TicketStatus newStatus,
                                     Administrator administrator) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + ticketId));

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(newStatus);
        ticketRepository.save(ticket);

        TicketUpdate update = buildUpdate(
                ticket,
                administrator,
                previousStatus,
                newStatus,
                String.format("Status changed from %s to %s", previousStatus, newStatus)
        );
        TicketUpdate saved = ticketUpdateRepository.save(update);


        return saved;
    }

    @Transactional
    public TicketUpdate assignTechnician(Long ticketId,
                                         Long newTechnicianId,
                                         Administrator administrator) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + ticketId));

        // ASSUMPTION: adjust to the actual method name in your TechnicianService.
        Technician technician = technicianService.getTechnicianById(newTechnicianId);

        // ASSUMPTION: adjust field/enum names to your actual TicketAssignment entity.
        TicketAssignment assignment = new TicketAssignment();
        assignment.setTicket(ticket);
        assignment.setTechnician(technician);
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setStatus(AssignmentStatus.PENDING);
        ticketAssignmentRepository.save(assignment);

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(TicketStatus.ASSIGNED);
        ticketRepository.save(ticket);

        TicketUpdate update = buildUpdate(
                ticket,
                administrator,
                previousStatus,
                TicketStatus.ASSIGNED,
                String.format("Assigned to technician %s %s",
                        technician.getFirstName(), technician.getLastName())
        );
        TicketUpdate saved = ticketUpdateRepository.save(update);



        return saved;
    }

    /**
     * A comment does not change status — previousStatus/newStatus are
     * both set to the ticket's current status just to satisfy the
     * NOT NULL columns.
     */
    @Transactional
    public TicketUpdate addComment(Long ticketId,
                                   String newComment,
                                   Administrator administrator) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + ticketId));

        TicketUpdate update = buildUpdate(
                ticket,
                administrator,
                ticket.getStatus(),
                ticket.getStatus(),
                newComment
        );
        return ticketUpdateRepository.save(update);
    }

    /**
     * ASSUMPTION: your stub had no parameters — I added ticketId, a reason,
     * and the acting administrator, since a rejection needs to know WHICH
     * ticket and WHY. Adjust the target status (CANCELLED here) to whatever
     * your workflow actually uses for a rejected ticket.
     */
    @Transactional
    public TicketUpdate rejectTicket(Long ticketId, String reason, Administrator administrator) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + ticketId));

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(TicketStatus.CANCELLED);
        ticketRepository.save(ticket);

        TicketUpdate update = buildUpdate(
                ticket,
                administrator,
                previousStatus,
                TicketStatus.CANCELLED,
                "Ticket rejected" + (reason != null && !reason.isBlank() ? ": " + reason : "")
        );
        TicketUpdate saved = ticketUpdateRepository.save(update);



        return saved;
    }

    /**
     * ASSUMPTION: same as above — added ticketId and administrator.
     * Target status set to RESOLVED; change to CLOSED if that's the
     * final state in your workflow instead.
     */
    @Transactional
    public TicketUpdate approveResolution(Long ticketId, Administrator administrator) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + ticketId));

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(TicketStatus.RESOLVED);
        ticketRepository.save(ticket);

        TicketUpdate update = buildUpdate(
                ticket,
                administrator,
                previousStatus,
                TicketStatus.RESOLVED,
                "Resolution approved"
        );
        TicketUpdate saved = ticketUpdateRepository.save(update);


        return saved;
    }

    // ---------------------------------------------------------------
    // Small helper to avoid repeating the same 5 setters everywhere.
    // ---------------------------------------------------------------
    private TicketUpdate buildUpdate(Ticket ticket,
                                     Administrator administrator,
                                     TicketStatus previousStatus,
                                     TicketStatus newStatus,
                                     String description) {
        TicketUpdate update = new TicketUpdate();
        update.setTicket(ticket);
        update.setUpdatedBy(administrator);
        update.setUpdatedAt(LocalDateTime.now());
        update.setPreviousStatus(previousStatus);
        update.setNewStatus(newStatus);
        update.setUpdateDescription(description);
        return update;
    }
}
