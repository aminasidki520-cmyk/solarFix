package com.example.demo.controllers;

import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.repository.user.TechnicianRepository;
import com.example.demo.service.notification.NotificationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.example.demo.repository.ticket.TicketAssignmentRepository;
import com.example.demo.service.ticket.TicketAssignmentService;
import com.example.demo.service.ticket.TicketService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
@RestController
@RequestMapping("/api/ticketAssignments")
public class ticketAssignmentController {

    @Autowired
    private TicketService ticketService;
    @Autowired
    private TicketAssignmentRepository ticketAssignmentRepository;
    @Autowired
    private TicketAssignmentService ticketAssignmentService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private TechnicianRepository technicianRepository;
    @Autowired
    private TicketRepository ticketRepository;
    //approve the assignement of the ticket
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public void approveTicketAssignment(@PathVariable Long id) {
        TicketAssignment ticketAssignment = ticketAssignmentRepository.findById(id).orElse(null);
        ticketAssignmentService.approveAssignment(id);
        //send the technician the notification
        notificationService.notifyTechnician(technicianRepository.findById(ticketAssignment.getTechnician().getId()).orElse(null), ticketRepository.findById(ticketAssignment.getTicket().getTicketId()).orElse(null));
    }

    //refuse
    @PutMapping("/{id}/refuse")
    @PreAuthorize("hasRole('ADMIN')")
    public void refuseTicketAssignmentAndReassign(@PathVariable Long id,@RequestParam Long newTechnicianId) {

        TicketAssignment ticketAssignment = ticketAssignmentRepository.findById(id).orElse(null);
        ticketAssignmentService.refuseAndReassign(id,newTechnicianId);
        //send the technician the notification
        notificationService.notifyTechnician(technicianRepository.findById(ticketAssignment.getTechnician().getId()).orElse(null), ticketRepository.findById(ticketAssignment.getTicket().getTicketId()).orElse(null));


    }
    // List assignments for a specific ticket (used by the frontend detail panel)
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TicketAssignment> getAssignmentsForTicket(@PathVariable Long ticketId) {
        return ticketRepository.findById(ticketId)
                .map(ticket -> ticket.getAssignments())
                .orElse(List.of());
    }

}
