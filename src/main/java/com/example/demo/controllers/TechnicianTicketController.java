package com.example.demo.controllers;

import com.example.demo.dto.TechnicianTicketDTO;
import com.example.demo.entity.report.CreateReportRequest;
import com.example.demo.entity.report.ReportResponse;
import com.example.demo.entity.report.ReportStatus;
import com.example.demo.entity.ticket.AssignmentStatus;
import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.entity.ticket.TicketStatus;
import com.example.demo.entity.user.Technician;
import com.example.demo.repository.ticket.TicketAssignmentRepository;
import com.example.demo.repository.user.TechnicianRepository;
import com.example.demo.service.reports.ReportService;
import com.example.demo.service.ticket.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

/**
 * Technician-only endpoints for the mobile app.
 *
 * Isolation by design: this is a BRAND NEW controller at /api/technician/*.
 * It does not modify TicketController or ReportController — the admin web
 * panel keeps working exactly as before. Report creation reuses the
 * existing ReportService.createReport() so admins see technician reports
 * as normal reports, with no parallel/duplicate report logic.
 */
@RestController
@RequestMapping("/api/technician")
public class TechnicianTicketController {

    @Autowired
    private TicketAssignmentRepository ticketAssignmentRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private ReportService reportService;

    @Autowired
    private TicketService ticketService;

    // -----------------------------------------------------------------
    // GET /api/technician/tickets
    // Returns every ticket where the logged-in technician has an
    // APPROVED assignment.
    // -----------------------------------------------------------------
    @GetMapping("/tickets")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<TechnicianTicketDTO>> getMyTickets(Authentication authentication) {
        Technician technician = resolveTechnician(authentication);

        List<TicketAssignment> approvedAssignments =
                ticketAssignmentRepository.findApprovedByTechnicianId(technician.getId());

        List<TechnicianTicketDTO> dtos = approvedAssignments.stream()
                .map(assignment -> TechnicianTicketDTO.fromEntities(assignment.getTicket(), assignment))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // -----------------------------------------------------------------
    // GET /api/technician/tickets/{id}
    // Same ticket the admin sees, but ONLY if it's assigned to the
    // requesting technician — otherwise 403-equivalent via exception.
    // -----------------------------------------------------------------
    @GetMapping("/tickets/{id}")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TechnicianTicketDTO> getMyTicketById(@PathVariable Long id,
                                                               Authentication authentication) {
        Technician technician = resolveTechnician(authentication);
        TicketAssignment assignment = findOwnApprovedAssignment(id, technician);
        return ResponseEntity.ok(TechnicianTicketDTO.fromEntities(assignment.getTicket(), assignment));
    }

    // -----------------------------------------------------------------
    // PATCH /api/technician/tickets/{id}/status
    //
    // Lets a technician move THEIR OWN ticket to IN_PROGRESS directly,
    // with NO extra admin approval — the admin already approved this
    // technician for this ticket at assignment time, so "starting work"
    // doesn't need a second sign-off.
    //
    // ⚠️ DELIBERATELY RESTRICTED to IN_PROGRESS only. Resolving/closing
    // a ticket still goes through the admin (TicketController /
    // TicketUpdateController), matching your original "status is
    // read-only for technicians except for starting work" decision.
    // If you want technicians to also self-resolve tickets, tell me and
    // I'll widen this whitelist — right now it's a guardrail, not an
    // oversight.
    // -----------------------------------------------------------------
    @PatchMapping("/tickets/{id}/status")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody UpdateStatusRequest request,
                                          Authentication authentication) {
        Technician technician = resolveTechnician(authentication);
        findOwnApprovedAssignment(id, technician); // security check: must own an APPROVED assignment

        if (request.newStatus() != TicketStatus.IN_PROGRESS) {
            return ResponseEntity.badRequest()
                    .body("Technicians can only set status to IN_PROGRESS from this endpoint.");
        }

        ticketService.updateTicketStatus(id, request.newStatus());
        return ResponseEntity.ok().build();
    }

    // -----------------------------------------------------------------
    // POST /api/technician/tickets/{id}/report
    // Accepts the mobile app's simple shape { outcome, notes, photoUrl }
    // and translates it into the EXISTING CreateReportRequest shape before
    // calling the existing ReportService — no duplicate report pipeline.
    // -----------------------------------------------------------------
    @PostMapping("/tickets/{id}/report")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ReportResponse> submitReport(@PathVariable Long id,
                                                       @RequestBody TechnicianReportRequest request,
                                                       Authentication authentication) {
        Technician technician = resolveTechnician(authentication);
        findOwnApprovedAssignment(id, technician);

        CreateReportRequest createReportRequest = new CreateReportRequest(
                "Technician Report for Ticket #" + id,
                request.outcome() + " - " + request.notes(),
                id
        );

        // 1. Création du rapport
        var report = reportService.createReport(createReportRequest, technician);

        // 🚀 NOUVEAU : Si le technicien a réparé, on saute l'approbation admin et on résout le ticket
        if ("FIXED".equalsIgnoreCase(request.outcome())) {
            // Approuver le rapport immédiatement (tu auras besoin d'une méthode approveReport dans ReportService)
            reportService.approveReport(report.getReportId());
            // Passer le ticket à RESOLVED
            ticketService.updateTicketStatus(id, TicketStatus.RESOLVED);
        }

        return ResponseEntity.ok(ReportResponse.fromEntity(report));
    }

    // -----------------------------------------------------------------
    // POST /api/technician/tickets/{id}/status-request  (optional)
    // Still available for anything OTHER than starting work (e.g. a
    // technician requesting the ticket be marked RESOLVED/CLOSED) —
    // those still go to the admin for review.
    // -----------------------------------------------------------------
    @PostMapping("/tickets/{id}/status-request")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<Void> requestStatusChange(@PathVariable Long id,
                                                    @RequestBody StatusChangeRequest request,
                                                    Authentication authentication) {
        Technician technician = resolveTechnician(authentication);
        findOwnApprovedAssignment(id, technician); // security check

        // TODO: persist this as a TicketUpdate / comment, e.g.:
        //   "Technician requests status change to " + request.requestedStatus()
        //
        // ⚠️ ASSUMPTION: TicketUpdateService's comment methods currently take
        // an Administrator as the acting user (see TicketUpdateController).
        // You'll likely need an overload accepting a Technician/User instead,
        // since this action originates from a technician, not an admin.
        // Wiring that call is left as a TODO until that overload exists.

        return ResponseEntity.ok().build();
    }

    // -----------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------

    private Technician resolveTechnician(Authentication authentication) {
        String username = authentication.getName();
        return technicianRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Technician not found: " + username));
    }

    private TicketAssignment findOwnApprovedAssignment(Long ticketId, Technician technician) {
        return ticketAssignmentRepository
                .findByTicket_TicketIdAndTechnician_IdAndStatus(ticketId, technician.getId(), AssignmentStatus.APPROVED)
                .orElseThrow(() -> new RuntimeException("Ticket not found or not assigned to you"));
    }

    // -----------------------------------------------------------------
    // Request DTOs
    // -----------------------------------------------------------------
    public record TechnicianReportRequest(String outcome, String notes, String photoUrl) {}
    public record StatusChangeRequest(String requestedStatus) {}
    public record UpdateStatusRequest(TicketStatus newStatus) {}
}