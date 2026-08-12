package com.example.demo.controllers;

import com.example.demo.entity.ticket.Ticket;
import com.example.demo.entity.ticket.TicketPriority;
import com.example.demo.entity.ticket.TicketStatus;
import com.example.demo.repository.ticket.TicketAssignmentRepository;
import com.example.demo.service.User.TechnicianService;
import com.example.demo.entity.ticket.CreateTicketRequest;
import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.service.ticket.TicketAssignmentService;
import com.example.demo.service.ticket.TicketService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import com.example.demo.entity.ticket.TicketUpdateRequest;

import java.util.List;
@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketService ticketService;
    @Autowired
    private TicketAssignmentRepository ticketAssignmentRepository;
    @Autowired
    private TicketAssignmentService ticketAssignmentService;

    //Admin methods//
    // Get all teckets
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // Get ticket by id
    @GetMapping("/{id}/get")
    @PreAuthorize("hasRole('ADMIN')")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }


//Get tickets by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getTicketsByStatus(@PathVariable TicketStatus status) {
        return ticketService.getTicketByStatus(status);}

//Get tickets by priority
    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getTicketsByPriority(@PathVariable TicketPriority priority) {
        return ticketService.getTicketsByPriority(priority);}

// Delete a ticket
    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);}


    // Update ticket status (OPEN, RESOLVED, CLOSED, etc.)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public void updateTicketStatus(@PathVariable Long id, @RequestParam TicketStatus status) {
        ticketService.updateTicketStatus(id, status);
    }

    // Mark a ticket as resolved (sets resolvedAt automatically)
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public void resolveTicket(@PathVariable Long id) {
        ticketService.resolveTicket(id);
    }

    // Close a ticket
    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public void closeTicket(@PathVariable Long id) {
        ticketService.closeTicket(id);
    }

    // Reopen a ticket
    @PutMapping("/{id}/reopen")
    @PreAuthorize("hasRole('ADMIN')")
    public void reopenTicket(@PathVariable Long id) {
        ticketService.reopenTicket(id);
    }

    // Add a free-text update/note to a ticket's history
    @PostMapping("/{id}/updates")
    @PreAuthorize("hasRole('ADMIN')")
    public void addTicketUpdate(@PathVariable Long id, @RequestBody TicketUpdateRequest request) {
        ticketService.addTicketUpdate(id, request.getDescription());
    }

    // List all assignments (pending/approved/rejected/reassigned) for one ticket —
// needed so the frontend can show who it's currently assigned to and its state
    @GetMapping("/{id}/assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TicketAssignment> getTicketAssignments(@PathVariable Long id) {
        return ticketService.getTicketById(id).getAssignments();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Ticket createTicket(@RequestBody CreateTicketRequest request) {
        return ticketService.createManualTicket(request);
    }





}


