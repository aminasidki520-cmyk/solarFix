package com.example.demo.controllers;

import com.example.demo.entity.report.Report;
import com.example.demo.entity.report.ReportStatus;
import com.example.demo.entity.report.ReportAnalyticsDTO; // 🚀 Import ajouté
import com.example.demo.entity.user.User;
import com.example.demo.entity.report.CreateReportRequest;
import com.example.demo.entity.report.ReportResponse;
import com.example.demo.entity.report.UpdateReportRequest;
import com.example.demo.entity.report.UpdateReportStatusRequest;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.service.reports.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@RequestBody CreateReportRequest request,
                                                       Authentication authentication) {
        User author = resolveAuthor(authentication);
        Report report = reportService.createReport(request, author);
        return ResponseEntity.ok(ReportResponse.fromEntity(report));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<ReportResponse> reports = reportService.getAllReports().stream()
                .map(ReportResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(ReportResponse.fromEntity(reportService.getReportById(id)));
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<ReportResponse>> getReportsByTicket(@PathVariable Long ticketId) {
        List<ReportResponse> reports = reportService.getReportsByTicket(ticketId).stream()
                .map(ReportResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReportResponse>> getReportsByStatus(@PathVariable ReportStatus status) {
        List<ReportResponse> reports = reportService.getReportsByStatus(status).stream()
                .map(ReportResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> updateReport(@PathVariable Long id,
                                                       @RequestBody UpdateReportRequest request) {
        return ResponseEntity.ok(ReportResponse.fromEntity(reportService.updateReport(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReportResponse> updateStatus(@PathVariable Long id,
                                                       @RequestBody UpdateReportStatusRequest request) {
        return ResponseEntity.ok(ReportResponse.fromEntity(reportService.updateStatus(id, request.newStatus())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ NOUVEL ENDPOINT
    @GetMapping("/analytics")
    public ResponseEntity<ReportAnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(reportService.getAnalytics());
    }

    private User resolveAuthor(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}