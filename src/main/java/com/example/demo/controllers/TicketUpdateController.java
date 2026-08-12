package com.example.demo.controllers;

import com.example.demo.entity.ticket.TicketPriority;
import com.example.demo.entity.ticket.TicketStatus;
import com.example.demo.entity.ticket.TicketUpdate;
import com.example.demo.entity.user.Administrator;
import com.example.demo.repository.ticket.TicketUpdateRepository;
import com.example.demo.repository.user.AdministratorRepository;
import com.example.demo.service.ticket.TicketUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/updates")
public class TicketUpdateController {

    @Autowired
    private TicketUpdateService ticketUpdateService;
    @Autowired
    private TicketUpdateRepository ticketUpdateRepository;
    // ASSUMPTION: used to resolve the logged-in Administrator from the JWT
    // principal (its username/email). Adjust to however your
    // AuthenticationPrincipal / Administrator lookup actually works.
    @Autowired
    private AdministratorRepository administratorRepository;

    @GetMapping
    public ResponseEntity<List<TicketUpdate>> getHistory(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketUpdateRepository.findByTicket_TicketIdOrderByUpdatedAtDesc(ticketId));
    }

    @PatchMapping("/priority")
    public ResponseEntity<TicketUpdate> changePriority(@PathVariable Long ticketId,
                                                       @RequestBody ChangePriorityRequest request,
                                                       Authentication authentication) {
        Administrator admin = resolveAdministrator(authentication);
        return ResponseEntity.ok(
                ticketUpdateService.changePriority(ticketId, request.newPriority(), admin)
        );
    }
 

    @PatchMapping("/assign")
    public ResponseEntity<TicketUpdate> assignTechnician(@PathVariable Long ticketId,
                                                         @RequestBody AssignTechnicianRequest request,
                                                         Authentication authentication) {
        Administrator admin = resolveAdministrator(authentication);
        return ResponseEntity.ok(
                ticketUpdateService.assignTechnician(ticketId, request.technicianId(), admin)
        );
    }

    @PostMapping("/comment")
    public ResponseEntity<TicketUpdate> addComment(@PathVariable Long ticketId,
                                                   @RequestBody AddCommentRequest request,
                                                   Authentication authentication) {
        Administrator admin = resolveAdministrator(authentication);
        return ResponseEntity.ok(
                ticketUpdateService.addComment(ticketId, request.comment(), admin)
        );
    }

    @PostMapping("/reject")
    public ResponseEntity<TicketUpdate> rejectTicket(@PathVariable Long ticketId,
                                                     @RequestBody RejectTicketRequest request,
                                                     Authentication authentication) {
        Administrator admin = resolveAdministrator(authentication);
        return ResponseEntity.ok(
                ticketUpdateService.rejectTicket(ticketId, request.reason(), admin)
        );
    }

    @PostMapping("/approve-resolution")
    public ResponseEntity<TicketUpdate> approveResolution(@PathVariable Long ticketId,
                                                          Authentication authentication) {
        Administrator admin = resolveAdministrator(authentication);
        return ResponseEntity.ok(
                ticketUpdateService.approveResolution(ticketId, admin)
        );
    }
    @PatchMapping("/status")
    public ResponseEntity<TicketUpdate> changeStatus(@PathVariable Long ticketId,
                                                     @RequestBody ChangeStatusRequest request,
                                                     Authentication authentication) {
        Administrator admin = resolveAdministrator(authentication);
        return ResponseEntity.ok(
                ticketUpdateService.changeStatus(ticketId, request.newStatus(), admin)
        );
    }

    // -----------------------------------------------------------------
    // ASSUMPTION: replace this with however you currently resolve the
    // logged-in Administrator elsewhere in the app (e.g. in your JWT
    // filter / UserDetailsService). `authentication.getName()` typically
    // holds the username or email used at login.
    // -----------------------------------------------------------------
    private Administrator resolveAdministrator(Authentication authentication) {
        String username = authentication.getName();
        return administratorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Administrator not found: " + username));
    }

    // -----------------------------------------------------------------
    // Request DTOs — plain Java records, one per action.
    // -----------------------------------------------------------------
    public record ChangePriorityRequest(TicketPriority newPriority) {}
    public record ChangeStatusRequest(TicketStatus newStatus) {}
    public record AssignTechnicianRequest(Long technicianId) {}
    public record AddCommentRequest(String comment) {}
    public record RejectTicketRequest(String reason) {}
}
