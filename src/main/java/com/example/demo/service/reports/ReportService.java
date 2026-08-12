package com.example.demo.service.reports;

import com.example.demo.entity.report.Report;
import com.example.demo.entity.report.ReportStatus;
import com.example.demo.entity.ticket.Ticket;
import com.example.demo.entity.user.User;
import com.example.demo.entity.report.CreateReportRequest;
import com.example.demo.entity.report.UpdateReportRequest;
import com.example.demo.repository.report.ReportRepository;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.entity.report.ReportAnalyticsDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private TicketRepository ticketRepository;


    @Transactional
    public Report createReport(CreateReportRequest request, User author) {
        Ticket ticket = ticketRepository.findById(request.ticketId())
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + request.ticketId()));

        Report report = new Report();
        report.setTitle(request.title());
        report.setContent(request.content());
        report.setCreatedAt(LocalDateTime.now());
        report.setStatus(ReportStatus.DRAFT);
        report.setTicket(ticket);
        report.setAuthor(author);

        return reportRepository.save(report);
    }

    @Transactional
    public Report updateReport(Long reportId, UpdateReportRequest request) {
        Report report = getReportOrThrow(reportId);
        report.setTitle(request.title());
        report.setContent(request.content());
        return reportRepository.save(report);
    }

    /**
     * ASSUMPTION about the workflow, since your enum is DRAFT / SUBMITTED /
     * APPROVED / REJECTED (a review workflow, not a "generation" workflow):
     * - DRAFT -> SUBMITTED : author submits the report for review
     * - SUBMITTED -> APPROVED / REJECTED : a reviewer (e.g. an Administrator)
     *   makes the call
     * This method does not enforce those transitions strictly (e.g. it
     * won't stop you going DRAFT -> APPROVED directly) — add validation
     * here if you want the workflow to be strict.
     */
    @Transactional
    public Report updateStatus(Long reportId, ReportStatus newStatus) {
        Report report = getReportOrThrow(reportId);
        report.setStatus(newStatus);
        return reportRepository.save(report);
    }
    @Transactional
    public Report approveReport(Long reportId) {
        Report report = getReportOrThrow(reportId);
        report.setStatus(ReportStatus.APPROVED);
        return reportRepository.save(report);
    }
    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

    public Report getReportById(Long reportId) {
        return getReportOrThrow(reportId);
    }

    public List<Report> getReportsByTicket(Long ticketId) {
        return reportRepository.findByTicket_TicketId(ticketId);
    }

    public List<Report> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new EntityNotFoundException("Report not found: " + reportId);
        }
        reportRepository.deleteById(reportId);
    }

    private Report getReportOrThrow(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("Report not found: " + reportId));
    }

    public ReportAnalyticsDTO getAnalytics() {
        // TODO : Remplacer les valeurs mock par des vraies requêtes COUNT et SUM SQL
        long totalReports = reportRepository.count(); // Nombre total de rapports
        long totalDownloads = 0; // À remplacer par une vraie colonne `download_count` sur Report si tu l'ajoutes
        long scheduledReports = 0; // À remplacer par une requête `WHERE status = 'SCHEDULED'`
        String storageUsed = "0 MB"; // À calculer si tu stockes la taille en base

        // Mock pour l'instant
        return new ReportAnalyticsDTO(totalDownloads, "+0%", scheduledReports, storageUsed);
    }
}
