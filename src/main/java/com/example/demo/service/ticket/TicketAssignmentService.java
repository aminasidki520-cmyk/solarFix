package com.example.demo.service.ticket;

import com.example.demo.entity.ticket.AssignmentStatus;
import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.repository.ticket.TicketAssignmentRepository;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.repository.user.AdministratorRepository;
import com.example.demo.service.User.TechnicianService;
import com.example.demo.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

@Slf4j


@Service
public class TicketAssignmentService {
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
    @Transactional//to ensure the save() is flushed and committed. Without it, changes might not be persisted.
    public TicketAssignment createTicketAssignement(Long technicianId, Long ticketId , Long administratorId) {
        System.out.println("Entering createTicketAssignment");
        System.out.println("========== ENTERING createTicketAssignement ==========");

        System.out.println("technicianId = " + technicianId);
        System.out.println("ticketId = " + ticketId);
        System.out.println("administratorId = " + administratorId);
        // Implementation for creating a ticket assignment
        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        System.out.println("Ticket found");
        var technician = technicianService.getTechnicianById(technicianId);
        System.out.println("Technician found");
        var administrator = administratorRepository.findById(administratorId).orElseThrow(() -> new RuntimeException("Administrator not found"));
        System.out.println("Administrator found");
        TicketAssignment ticketAssignment = new TicketAssignment();
        ticketAssignment.setTicket(ticket);
        ticketAssignment.setTechnician(technician);
        ticketAssignment.setAdministrator(administrator);
        ticketAssignment.setAssignedAt(LocalDateTime.now());
        ticketAssignment.setStatus(AssignmentStatus.PENDING);
        log.info("createTicketAssignement() called with technicianId: {}, ticketId: {}, administratorId: {}", technicianId, ticketId, administratorId);
        // Save assignment
        ticketAssignmentRepository.save(ticketAssignment);
        System.out.println("Assignment saved");
        System.out.println(ticketAssignment.getAssignmentId());
        log.info("Ticket assignment saved with ID: {}", ticketAssignment.getAssignmentId());
        System.out.println(ticketId);
        System.out.println(technicianId);
        System.out.println(administratorId);
    return ticketAssignment;

    }

    public void approveAssignment(Long assignmentId) {
        var assignment = ticketAssignmentRepository.findById(assignmentId).orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignment.setStatus(AssignmentStatus.APPROVED);
        ticketAssignmentRepository.save(assignment);
    }

    public void refuseAndReassign(Long assignmentId,Long newTechnicianId) {
        //Refuse assignment
        var assignment = ticketAssignmentRepository.findById(assignmentId).orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignment.setStatus(AssignmentStatus.REJECTED);
        ticketAssignmentRepository.save(assignment);

        //Reassign to new technician
        var ticketId = assignment.getTicket().getTicketId();

       TicketAssignment ticketAssignment= createTicketAssignement(newTechnicianId, ticketId, assignment.getAdministrator().getId());
       ticketAssignment.setStatus(AssignmentStatus.REASSIGNED);



    }
}
