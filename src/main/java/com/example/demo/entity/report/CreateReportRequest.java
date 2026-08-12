package com.example.demo.entity.report;

// Request body for POST /api/reports
public record CreateReportRequest(
        String title,
        String content,
        Long ticketId
) {}
