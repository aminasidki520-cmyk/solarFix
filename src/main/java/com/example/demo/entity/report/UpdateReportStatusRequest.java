package com.example.demo.entity.report;

import com.example.demo.entity.report.ReportStatus;

// Request body for PATCH /api/reports/{id}/status
public record UpdateReportStatusRequest(
        ReportStatus newStatus
) {}
