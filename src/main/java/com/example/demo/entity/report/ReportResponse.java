package com.example.demo.entity.report;

import com.example.demo.entity.report.Report;
import com.example.demo.entity.report.ReportStatus;

import java.time.LocalDateTime;

// Flat, safe-to-serialize view of a Report — avoids exposing the full
// Ticket/User entity graphs (and any lazy-loading issues) directly.
public record ReportResponse(
        Long reportId,
        String title,
        String content,
        LocalDateTime createdAt,
        ReportStatus status,
        Long ticketId,
        String ticketTitle,
        Long authorId,
        String authorName
) {
    // ASSUMPTION: adjust getters below (getFirstName/getLastName/getTitle...)
    // to match your actual User / Ticket entity field names if different.
    public static ReportResponse fromEntity(Report report) {
        return new ReportResponse(
                report.getReportId(),
                report.getTitle(),
                report.getContent(),
                report.getCreatedAt(),
                report.getStatus(),
                report.getTicket() != null ? report.getTicket().getTicketId() : null,
                report.getTicket() != null ? report.getTicket().getTitle() : null,
                report.getAuthor() != null ? report.getAuthor().getId() : null,
                report.getAuthor() != null
                        ? (report.getAuthor().getFirstName() + " " + report.getAuthor().getLastName())
                        : null
        );
    }
}
