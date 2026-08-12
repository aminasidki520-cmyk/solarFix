package com.example.demo.dto;

import com.example.demo.entity.report.Report;
import com.example.demo.entity.ticket.Ticket;
import com.example.demo.entity.ticket.TicketAssignment;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Comparator;
import java.util.List;


public record TechnicianTicketDTO(
        Long ticketId,
        String title,
        String description,
        String status,
        String priority,
        Double latitude,
        Double longitude,
        String location,
        String equipmentLabel,
        LocalDateTime assignedAt,
        LocalDateTime resolvedAt,
        String reportOutcome,
        String reportNotes
) {

    private static final Pattern POINT_PATTERN = Pattern.compile("POINT\\(([\\d.]+)\\s+([\\d.]+)\\)");

    public static TechnicianTicketDTO fromEntities(Ticket ticket, TicketAssignment assignment) {
        var anomaly = ticket.getAnomaly();
        var equipment = anomaly != null ? anomaly.getEquipment() : null;

        Double latitude = null;
        Double longitude = null;
        if (anomaly != null && anomaly.getGeometry() != null) {
            Matcher matcher = POINT_PATTERN.matcher(anomaly.getGeometry());
            if (matcher.matches()) {
                try {
                    latitude = Double.parseDouble(matcher.group(1));
                    longitude = Double.parseDouble(matcher.group(2));
                } catch (NumberFormatException e) {}
            }
        }

        String equipmentLabel = null;
        if (equipment != null) {
            equipmentLabel = equipment.getModel() + " (" + equipment.getSerialNumber() + ")";
        }
        String reportOutcome = null;
        String reportNotes = null;
        List<Report> reports = ticket.getReports();
        if (reports != null && !reports.isEmpty()) {
            Report latestReport = reports.stream()
                    .max(Comparator.comparing(Report::getCreatedAt))
                    .orElse(null);

            if (latestReport != null) {
                String content = latestReport.getContent(); // Format : "FIXED - Notes écrites ici"
                if (content != null) {
                    String[] parts = content.split(" - ", 2);
                    reportOutcome = parts.length > 0 ? parts[0] : content;
                    reportNotes = parts.length > 1 ? parts[1] : "";
                }
            }
        }
        return new TechnicianTicketDTO(
                ticket.getTicketId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus() != null ? ticket.getStatus().name() : null,
                ticket.getPriority() != null ? ticket.getPriority().name() : null,
                latitude,
                longitude,
                equipment != null ? equipment.getLocation() : null,
                equipmentLabel,
                assignment != null ? assignment.getAssignedAt() : null,
                ticket.getResolvedAt(),reportOutcome,
                reportNotes
        );
    }
}
